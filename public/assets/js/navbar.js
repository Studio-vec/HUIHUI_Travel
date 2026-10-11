/**
 * Travel HUIHUI — 공유 네브바 컴포넌트
 * 모든 페이지에서 <script src="...navbar.js"></script> 한 줄로 삽입됩니다.
 */
(function () {
  'use strict';

  const page    = window.location.pathname.replace(/\/$/, '').split('/').pop() || '';
  const BLOG    = 'https://blog.naver.com/kty1297';

  /* ── CSS ─────────────────────────────────────────────────── */
  const css = `
/* 전통 × 에디토리얼: 한지 바탕, 먹 글씨, 가는 선, 연지 낙관 하나 */
.hh-navbar {
  position: sticky; top: 0; z-index: 500;
  background: rgba(244,241,234,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(32,41,67,0.14);
  height: 60px; padding: 0 clamp(16px,4vw,48px);
  display: flex; align-items: center; gap: 28px;
}
.hh-navbar-logo {
  display: inline-flex; align-items: center; gap: 10px; min-height: 44px;
  font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
  font-size: 16px; font-weight: 700; letter-spacing: 0.04em;
  color: #202943; text-decoration: none; flex-shrink: 0; white-space: nowrap;
}
.hh-navbar-logo img { width: 40px; height: 28px; display: block; }
.hh-navbar-logo small {
  font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif; font-size: 11px; font-weight: 400; letter-spacing: 0.08em;
  color: #646B84; padding-left: 10px; border-left: 1px solid rgba(32,41,67,0.2);
}
.hh-navbar-links { display: flex; list-style: none; gap: 22px; margin: 0; padding: 0; }
.hh-navbar-links a {
  display: inline-flex; align-items: center; min-height: 44px; white-space: nowrap;
  font-size: 13px; font-weight: 500; letter-spacing: 0.04em; color: #4E5672;
  text-decoration: none; position: relative;
  transition: color 150ms;
}
.hh-navbar-links a::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 10px; height: 1px;
  background: #EF4D6D; transform: scaleX(0); transform-origin: left; transition: transform 250ms cubic-bezier(0.22,1,0.36,1);
}
.hh-navbar-links a:hover { color: #202943; }
.hh-navbar-links a:hover::after, .hh-navbar-links a.active::after { transform: scaleX(1); }
.hh-navbar-links a.active { color: #202943; }
.hh-navbar-search { flex: 1; display: flex; justify-content: flex-end; align-items: center; }
.hh-search-inner { position: relative; display: inline-flex; align-items: center; }
.hh-search-icon { position: absolute; left: 0; pointer-events: none; color: #646B84; display: flex; align-items: center; }
.hh-navbar-search input {
  font-family: inherit; font-size: 12px; color: #202943;
  background: transparent; border: none; border-bottom: 1px solid rgba(32,41,67,0.25); border-radius: 0;
  padding: 7px 4px 7px 20px; outline: none; width: clamp(120px,16vw,180px);
  transition: border-color .2s;
}
.hh-navbar-search input::placeholder { color: #8A7D6E; }
.hh-navbar-search input:focus { border-color: #202943; }
.hh-user-area { display: flex; align-items: center; flex-shrink: 0; }
.hh-login-btn {
  font-size: 12px; font-weight: 500; letter-spacing: 0.06em; color: #F7F0E5;
  text-decoration: none; padding: 8px 16px; white-space: nowrap;
  background: #202943; border-radius: 2px; transition: background .15s;
}
.hh-login-btn:hover { background: #EF4D6D; }
.hh-user-btn {
  display: flex; align-items: center; gap: 8px;
  text-decoration: none; padding: 4px 4px; max-width: 160px;
}
.hh-user-btn:hover .hh-user-nick { color: #202943; }
.hh-avatar {
  width: 26px; height: 26px; border-radius: 2px;
  background: #EF4D6D; color: #F7F0E5; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.hh-user-nick { font-size: 12px; font-weight: 500; color: #4E5672; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hh-hamburger {
  display: none; flex-shrink: 0; margin-left: 4px;
  background: none; border: none; cursor: pointer;
  width: 44px; height: 44px; border-radius: 2px;
  align-items: center; justify-content: center; color: #202943;
}
.hh-mobile-menu {
  position: fixed; top: 60px; left: 0; right: 0; z-index: 499;
  background: rgba(244,241,234,0.98); backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(32,41,67,0.14);
  padding: 8px 20px 16px; display: none; flex-direction: column;
}
.hh-mobile-menu.open { display: flex; }
.hh-mm-item {
  font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
  font-size: 18px; font-weight: 500; color: #202943;
  text-decoration: none; padding: 12px 0; border-bottom: 1px solid rgba(32,41,67,0.08);
  display: flex; align-items: center; gap: 10px;
  background: none; border-left: none; border-right: none; border-top: none;
  cursor: pointer; width: 100%; text-align: left;
}
.hh-mm-item:hover { color: #C9304F; }
.hh-mm-item.active { color: #C9304F; }
.hh-mm-divider { border: none; margin: 6px 0; }
.hh-mm-logout {
  font-size: 13px; color: #646B84; padding: 10px 0;
  background: none; border: none; cursor: pointer; width: 100%; text-align: left;
}
.hh-mm-logout:hover { color: #C9304F; }
.hh-view-btn, .hh-lang-btn {
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  font-family: inherit; font-size: 12px; font-weight: 500; letter-spacing: 0.04em; color: #4E5672;
  background: none; border: none; border-radius: 0; padding: 6px 2px; cursor: pointer; white-space: nowrap;
  transition: color .15s;
}
.hh-view-btn:hover, .hh-lang-btn:hover { color: #202943; }
.hh-view-btn svg, .hh-mm-item svg { flex-shrink: 0; }
.hh-lang-wrap { position: relative; flex-shrink: 0; }
.hh-lang-btn svg { flex-shrink: 0; transition: transform .2s; }
.hh-lang-btn.open svg { transform: rotate(180deg); }
.hh-lang-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0;
  background: #FBF7F0; border: 1px solid rgba(32,41,67,0.16); border-radius: 2px;
  box-shadow: 0 12px 32px rgba(32,41,67,0.10);
  min-width: 128px; overflow: hidden;
  opacity: 0; transform: translateY(-6px); pointer-events: none;
  transition: opacity .18s, transform .18s; z-index: 600;
}
.hh-lang-dropdown.open { opacity: 1; transform: translateY(0); pointer-events: auto; }
.hh-lang-opt {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500; color: #4E5672;
  padding: 10px 16px; cursor: pointer; font-family: inherit;
  border: none; background: none; width: 100%; text-align: left;
}
.hh-lang-opt:hover { color: #202943; background: rgba(32,41,67,0.04); }
.hh-lang-opt.selected { color: #C9304F; font-weight: 700; }
.hh-mm-lang-row { display: flex; gap: 16px; padding: 12px 0; flex-wrap: wrap; }
.hh-mm-lang-chip {
  font-size: 13px; font-weight: 500; color: #646B84; font-family: inherit;
  border: none; border-bottom: 1px solid transparent; border-radius: 0;
  padding: 4px 0; cursor: pointer; background: none;
}
.hh-mm-lang-chip:hover { color: #202943; }
.hh-mm-lang-chip.selected { color: #202943; border-bottom-color: #EF4D6D; font-weight: 700; }
@media (max-width: 960px) {
  .hh-navbar-search { display: none; }
  .hh-navbar-links { margin-right: auto; }
}
@media (max-width: 1100px) {
  .hh-view-txt { display: none; }
  .hh-navbar-logo small { display: none; }
}
@media (max-width: 767px) {
  .hh-navbar-links  { display: none !important; }
  .hh-hamburger     { display: flex !important; margin-left: auto; }
  .hh-user-area     { display: none; }
  .hh-lang-wrap     { display: none; }
  .hh-view-btn      { display: none; }
}
@media (min-width: 768px) {
  .hh-mobile-menu { display: none !important; }
}`;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── 네브바 HTML ─────────────────────────────────────────── */
  const homeActive    = (page === '' || page === 'index') ? ' class="active"' : '';
  const galleryActive = page === 'gallery' ? ' class="active"' : '';
  const gameActive    = page === 'game'    ? ' class="active"' : '';
  const aboutActive   = page === 'about'   ? ' class="active"' : '';

  /* PC↔모바일 화면 전환 버튼: 폰 프레임 안이거나 이미 좁은 데스크톱 창이면 target이 null */
  const V = window.hhView;
  const showView = !!(V && V.target);

  const nav = document.createElement('nav');
  nav.className = 'hh-navbar';
  nav.innerHTML = `
  <a href="/" class="hh-navbar-logo" aria-label="Travel HUIHUI 홈"><img src="/assets/brand/huihui-logo.svg" alt="" width="40" height="28"/>Travel HUIHUI<small>국내 여행 안내서</small></a>
  <ul class="hh-navbar-links">
    <li><a href="/"${homeActive}>홈</a></li>
    <li><a href="/gallery"${galleryActive}>갤러리</a></li>
    <li><a href="/game"${gameActive}>짐싸기</a></li>
    <li><a href="/about"${aboutActive}>소개</a></li>
    <li><a href="${BLOG}" target="_blank" rel="noopener">블로그</a></li>
  </ul>
  <div class="hh-navbar-search">
    <div class="hh-search-inner">
      <span class="hh-search-icon">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </span>
      <input id="hhNavSearch" type="text" placeholder="여행지 검색하기"/>
    </div>
  </div>
  ${showView ? '<button class="hh-view-btn" id="hhViewBtn" type="button"></button>' : ''}
  <div class="hh-lang-wrap" id="hhLangWrap">
    <button class="hh-lang-btn" id="hhLangBtn" aria-haspopup="listbox" aria-expanded="false">
      <span id="hhLangLabel">한국어</span>
      <svg width="11" height="7" viewBox="0 0 11 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4.5 5L10 1"/></svg>
    </button>
    <div class="hh-lang-dropdown" id="hhLangDropdown" role="listbox"></div>
  </div>
  <div class="hh-user-area" id="hhUserArea">
    <a href="/auth/login" class="hh-login-btn">로그인</a>
  </div>
  <button class="hh-hamburger" id="hhHamburger" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="hhMobileMenu">
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
      <path d="M1 1.5h18M1 7.5h18M1 13.5h18"/>
    </svg>
  </button>`;

  /* ── 모바일 메뉴 HTML ─────────────────────────────────────── */
  const menu = document.createElement('div');
  menu.className = 'hh-mobile-menu';
  menu.id = 'hhMobileMenu';
  menu.setAttribute('role', 'navigation');
  menu.setAttribute('aria-label', '모바일 메뉴');
  menu.innerHTML = `
  <a class="hh-mm-item${(page === '' || page === 'index') ? ' active' : ''}" href="/">홈</a>
  <a class="hh-mm-item${page === 'gallery' ? ' active' : ''}" href="/gallery">갤러리</a>
  <a class="hh-mm-item${page === 'game'    ? ' active' : ''}" href="/game">짐싸기</a>
  <a class="hh-mm-item${page === 'about'   ? ' active' : ''}" href="/about">소개</a>
  <a class="hh-mm-item" href="${BLOG}" target="_blank" rel="noopener">블로그</a>
  <hr class="hh-mm-divider"/>
  <div class="hh-mm-lang-row" id="hhMobileLangRow"></div>
  <hr class="hh-mm-divider"/>
  ${showView ? '<button class="hh-mm-item" id="hhMobileView" type="button"></button><hr class="hh-mm-divider"/>' : ''}
  <div id="hhMobileUser">
    <a class="hh-mm-item" href="/auth/login">로그인 / 회원가입</a>
  </div>`;

  /* ── 삽입 ─────────────────────────────────────────────────── */
  const script = document.currentScript;
  script.parentNode.insertBefore(nav,  script);
  script.parentNode.insertBefore(menu, script);

  /* ── PC/모바일 화면 전환 버튼 ─────────────────────────── */
  if (showView) {
    const ICON = {
      mobile: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>',
      desktop: '<svg width="15" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    };
    const TXT = { mobile: '모바일 화면', desktop: 'PC 화면' };
    const label = TXT[V.target] + '으로 보기';
    const vb  = nav.querySelector('#hhViewBtn');
    const mvb = menu.querySelector('#hhMobileView');
    vb.innerHTML = ICON[V.target] + '<span class="hh-view-txt">' + TXT[V.target] + '</span>';
    vb.title = label; vb.setAttribute('aria-label', label);
    mvb.innerHTML = ICON[V.target] + '<span>' + label + '</span>';
    vb.addEventListener('click', V.toggle);
    mvb.addEventListener('click', V.toggle);
  }

  /* ── 이벤트: 햄버거 + 검색 ──────────────────────────────── */
  const hamBtn = nav.querySelector('#hhHamburger');

  function _setMenu(open, opts) {
    menu.classList.toggle('open', open);
    hamBtn.setAttribute('aria-expanded', String(open));
    hamBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    if (open && opts && opts.focusFirst) {
      const first = menu.querySelector('a, button');
      if (first) first.focus();
    }
    if (!open && opts && opts.returnFocus) hamBtn.focus();
  }
  const _menuOpen = () => menu.classList.contains('open');

  hamBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    /* 키보드(Enter/Space)로 열었을 때만 첫 항목으로 포커스 이동. 터치·마우스는 detail > 0 */
    _setMenu(!_menuOpen(), { focusFirst: e.detail === 0 });
  });
  document.addEventListener('click', function (e) {
    if (_menuOpen() && !menu.contains(e.target)) _setMenu(false);
  });
  /* 메뉴 안 링크를 누르면 닫는다 (같은 페이지 링크에서도 메뉴가 남지 않게) */
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) _setMenu(false);
  });
  /* Esc로 닫고 햄버거 버튼으로 포커스 복귀 */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && _menuOpen()) _setMenu(false, { returnFocus: true });
  });
  /* Tab으로 메뉴 밖으로 나가면 닫는다 */
  menu.addEventListener('focusout', function (e) {
    if (_menuOpen() && e.relatedTarget && !menu.contains(e.relatedTarget) && e.relatedTarget !== hamBtn) _setMenu(false);
  });
  /* 창이 넓어져 햄버거가 사라지면 열린 메뉴도 닫는다 */
  const _wideMq = window.matchMedia('(min-width: 768px)');
  const _onWide = () => { if (_wideMq.matches && _menuOpen()) _setMenu(false); };
  if (_wideMq.addEventListener) _wideMq.addEventListener('change', _onWide);
  else if (_wideMq.addListener) _wideMq.addListener(_onWide);

  const si = nav.querySelector('#hhNavSearch');
  si.addEventListener('input', function () {
    if (typeof window.filterBySearch === 'function') window.filterBySearch(si.value);
  });
  si.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !si.value.trim()) return;
    if (typeof window.filterBySearch === 'function') {
      window.filterBySearch(si.value.trim());
    } else {
      window.location.href = '/gallery?q=' + encodeURIComponent(si.value.trim());
    }
  });

  /* ── 언어 드롭다운 ─────────────────────────────────────── */
  const LANGS = [
    { label: '한국어', code: 'ko', flag: '🇰🇷' },
    { label: 'English', code: 'en', flag: '🇺🇸' },
    { label: '日本語',  code: 'ja', flag: '🇯🇵' },
    { label: '中文',   code: 'zh', flag: '🇨🇳' },
  ];

  window.hhLang = window.hhLang || 'ko';

  const langBtn      = nav.querySelector('#hhLangBtn');
  const langLabel    = nav.querySelector('#hhLangLabel');
  const langDropdown = nav.querySelector('#hhLangDropdown');
  const mobileLangRow = menu.querySelector('#hhMobileLangRow');

  function _renderLangOptions() {
    langDropdown.innerHTML = LANGS.map(l => `
      <button class="hh-lang-opt${window.hhLang === l.code ? ' selected' : ''}" data-code="${l.code}">
        <span>${l.flag}</span><span>${l.label}</span>
      </button>`).join('');

    mobileLangRow.innerHTML = LANGS.map(l => `
      <button class="hh-mm-lang-chip${window.hhLang === l.code ? ' selected' : ''}" data-code="${l.code}">
        ${l.flag} ${l.label}
      </button>`).join('');

    const cur = LANGS.find(l => l.code === window.hhLang);
    if (cur) langLabel.textContent = cur.label;
  }

  function _selectLang(code) {
    if (window.hhLang === code) return;
    window.hhLang = code;
    _renderLangOptions();
    _closeLangDropdown();
    document.dispatchEvent(new CustomEvent('hh:langchange', { detail: { code } }));
  }

  function _closeLangDropdown() {
    langDropdown.classList.remove('open');
    langBtn.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');
  }

  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = langDropdown.classList.contains('open');
    if (isOpen) {
      _closeLangDropdown();
    } else {
      langDropdown.classList.add('open');
      langBtn.classList.add('open');
      langBtn.setAttribute('aria-expanded', 'true');
    }
  });

  langDropdown.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-code]');
    if (btn) _selectLang(btn.dataset.code);
  });

  mobileLangRow.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-code]');
    if (btn) _selectLang(btn.dataset.code);
  });

  document.addEventListener('click', function (e) {
    if (!nav.querySelector('#hhLangWrap').contains(e.target)) _closeLangDropdown();
  });

  _renderLangOptions();

  /* ── Supabase 인증 상태 반영 ─────────────────────────────── */
  /* 닉네임 등 사용자 입력값을 innerHTML에 넣기 전에 escape */
  function _esc(v) {
    return String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  async function _updateUserBtn() {
    if (typeof window._sb === 'undefined') return;
    try {
      const { data: { session } } = await window._sb.auth.getSession();
      const userArea    = document.getElementById('hhUserArea');
      const mobileUser  = document.getElementById('hhMobileUser');
      if (!userArea) return;

      if (session) {
        const { data: profile } = await window._sb
          .from('profiles')
          .select('nickname, username')
          .eq('id', session.user.id)
          .single();

        const nickRaw = profile?.nickname || '사용자';
        const nick    = _esc(nickRaw);
        const initial = _esc(nickRaw.charAt(0).toUpperCase());

        userArea.innerHTML = `
          <a href="/auth/profile" class="hh-user-btn">
            <span class="hh-avatar">${initial}</span>
            <span class="hh-user-nick">${nick}</span>
          </a>`;

        if (mobileUser) {
          mobileUser.innerHTML = `
            <a class="hh-mm-item" href="/auth/profile">
              <span class="hh-avatar" style="width:22px;height:22px;font-size: 12px;">${initial}</span>
              ${nick}님의 페이지
            </a>
            <button class="hh-mm-logout" id="hhMobileLogout">로그아웃</button>`;

          document.getElementById('hhMobileLogout')?.addEventListener('click', _logout);
        }

        /* 로그인 상태를 전역으로 공유 (벨 팝업 등에서 사용) */
        window._hhUser = { session, profile };
      } else {
        window._hhUser = null;
      }
    } catch (_) {
      window._hhUser = null;
    }
  }

  async function _logout() {
    if (!window._sb) return;
    await window._sb.auth.signOut();
    window._hhUser = null;
    window.location.reload();
  }

  /* load 이벤트: Supabase CDN이 모두 로드된 뒤 실행 */
  window.addEventListener('load', async () => {
    await _updateUserBtn();

    /* OAuth 콜백 후 세션이 뒤늦게 확립될 때도 반영 */
    if (window._sb) {
      window._sb.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await _updateUserBtn();
        } else if (event === 'SIGNED_OUT') {
          const userArea   = document.getElementById('hhUserArea');
          const mobileUser = document.getElementById('hhMobileUser');
          if (userArea)   userArea.innerHTML   = `<a href="/auth/login" class="hh-login-btn">로그인</a>`;
          if (mobileUser) mobileUser.innerHTML = `<a class="hh-mm-item" href="/auth/login">로그인 / 회원가입</a>`;
          window._hhUser = null;
        }
      });
    }
  });
})();
