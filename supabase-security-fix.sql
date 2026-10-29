-- ══════════════════════════════════════════════════════════════
-- Travel HUIHUI — 보안 보완 (2026-10)
-- 이미 운영 중인 DB에 한 번 실행한다. Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- 새로 만드는 DB는 supabase-setup.sql 만 실행하면 된다 (같은 내용이 반영돼 있다).
--
-- ⚠ 사이트를 이메일 로그인 버전으로 먼저 배포한 뒤 실행하세요.
--   예전 로그인 화면은 get_email_by_username 을 쓰므로, 순서가 바뀌면 그 사이에 로그인이 안 된다.
-- ══════════════════════════════════════════════════════════════

-- 1. 누구나 아이디 → 이메일, 이메일 → 아이디를 조회할 수 있던 함수 제거
drop function if exists public.get_email_by_username(text);
drop function if exists public.get_username_by_email(text);

-- 2. 아이디(username)는 바꿀 수 없게: 수정 권한을 바꿔도 되는 컬럼에만 준다
revoke update on public.profiles from anon, authenticated;
grant update (nickname, phone, marketing_email, marketing_sms, updated_at)
  on public.profiles to authenticated;

drop policy if exists "self_update" on public.profiles;
create policy "self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 3. 아이디에 HTML 문자가 들어가지 않게 (가입 시 형식 검사는 브라우저에서만 하고 있었다)
--    not valid: 기존 행은 검사하지 않고, 앞으로 들어오는 값만 검사한다
alter table public.profiles
  add constraint profiles_username_no_html check (username !~ '[<>"''&]') not valid;

-- 4. 구글 로그인 가입이 username NOT NULL 에 걸려 실패하던 문제: 메타데이터가 없으면 아이디·닉네임을 만들어 넣는다
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, nickname, phone, marketing_email, marketing_sms)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'username', ''),
      'g' || left(replace(new.id::text, '-', ''), 15)
    ),
    left(coalesce(
      nullif(trim(new.raw_user_meta_data->>'nickname'), ''),
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(split_part(new.email, '@', 1), ''),
      '여행자'
    ), 20),
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'marketing_email')::boolean, false),
    coalesce((new.raw_user_meta_data->>'marketing_sms')::boolean, false)
  );
  return new;
end;
$$;

-- 5. 대시보드에서 직접 바꿀 설정
--    - Authentication > Providers > Email > "Confirm email" 켜기
--    - Authentication > URL Configuration > Site URL = https://travel.studiovec.com
