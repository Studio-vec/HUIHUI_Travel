-- ══════════════════════════════════════════════════════════════
-- Travel HUIHUI — Supabase 초기 세팅 SQL
-- Supabase 대시보드 > SQL Editor 에 아래 전체를 붙여넣고 실행하세요.
-- ══════════════════════════════════════════════════════════════

-- 1. profiles 테이블 생성
create table public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  username        text unique not null            -- 아이디 (변경불가, 표시용 — 로그인은 이메일)
                  check (username !~ '[<>"''&]'),
  nickname        text not null,                  -- 닉네임 (변경가능)
  phone           text,                           -- 전화번호 (변경가능)
  marketing_email boolean default false,          -- 이메일 광고 수신 동의
  marketing_sms   boolean default false,          -- SMS 광고 수신 동의
  updated_at      timestamptz default now()
);

-- 2. RLS(행 수준 보안) 활성화
alter table public.profiles enable row level security;

-- 3. 정책: 본인 프로필만 읽기 / 수정 가능
create policy "self_select" on public.profiles
  for select using (auth.uid() = id);

create policy "self_insert" on public.profiles
  for insert with check (auth.uid() = id);

create policy "self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 아이디(username)는 바꿀 수 없다: 수정 권한을 바꿔도 되는 컬럼에만 준다
revoke update on public.profiles from anon, authenticated;
grant update (nickname, phone, marketing_email, marketing_sms, updated_at)
  on public.profiles to authenticated;

-- 4. 회원가입 트리거 — signUp 시 메타데이터로 profiles 자동 생성
--    구글 로그인은 username·nickname 메타데이터가 없으므로 id에서 아이디를, 구글 이름·이메일에서 닉네임을 만든다
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. 로그인은 이메일로 한다. 아이디↔이메일을 바꿔 주는 함수는 누구나 회원 이메일을 조회할 수 있게 되므로 두지 않는다.

-- 6. 아이디 중복 확인 함수 — 회원가입 중복체크 시 사용
create or replace function public.is_username_taken(p_username text)
returns boolean
language sql security definer set search_path = public
as $$
  select exists(select 1 from public.profiles where username = p_username);
$$;

-- 7. 일시정지 방지 — 무료 플랜은 7일간 활동이 없으면 프로젝트를 멈춘다.
--    빈 결과만 돌아오는 읽기 요청은 활동으로 치지 않아(2026-10 실제로 멈춤) 한 줄을 실제로 고쳐 쓴다.
--    .github/workflows/supabase-keepalive.yml 이 매일 rpc/keepalive 를 부른다.
--    이미 만든 프로젝트에는 이 7번 블록만 따로 SQL Editor에서 실행한다 (1번부터 다시 돌리면 profiles에서 멈춘다).
create table if not exists public.keepalive (
  id        int primary key default 1 check (id = 1),   -- 늘 한 줄만
  pinged_at timestamptz not null default now()
);
alter table public.keepalive enable row level security;  -- 정책 없음: 표를 직접 읽고 쓸 수 없다

create or replace function public.keepalive()
returns timestamptz
language sql security definer set search_path = public
as $$
  insert into public.keepalive (id, pinged_at) values (1, now())
  on conflict (id) do update set pinged_at = excluded.pinged_at
    where keepalive.pinged_at < now() - interval '1 hour'   -- 공개 키로 연타해도 시간당 한 번만 쓴다
  returning pinged_at;   -- 건너뛰면 null
$$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon, authenticated;

-- ══════════════════════════════════════════════════════════════
-- Supabase 대시보드 설정 체크리스트 (SQL 실행 후 확인)
-- 1. Authentication > Providers > Email > "Confirm email" 옵션 활성화
--    (끄면 남의 이메일로도 가입할 수 있다)
-- 2. Authentication > URL Configuration > Site URL = https://travel.studiovec.com
-- 3. Authentication > URL Configuration > Redirect URLs 에 https://travel.studiovec.com/auth/** 추가
-- ══════════════════════════════════════════════════════════════
