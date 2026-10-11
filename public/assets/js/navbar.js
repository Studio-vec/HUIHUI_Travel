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
/* 전통 테마: 네브바는 기와집 처마처럼 밤빛(먹·쪽) 바탕에 금·연지 포인트 */
.hh-navbar {
  position: sticky; top: 0; z-index: 500;
  background: rgba(15,20,27,0.94); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(207,169,78,0.35);
  box-shadow: 0 3px 0 -1px rgba(178,58,68,0.55);
  height: 56px; padding: 0 clamp(16px,4vw,48px);
  display: flex; align-items: center; gap: 20px;
}
.hh-navbar-logo {
  display: inline-flex; align-items: center; gap: 9px; min-height: 44px;
  font-family: 'Gowun Batang', 'Noto Serif KR', serif;
  font-size: 18px; font-weight: 700; letter-spacing: 0.06em;
  color: #F1E2B4; text-decoration: none; flex-shrink: 0; white-space: nowrap;
}
.hh-navbar-logo img { width: 26px; height: 26px; display: block; }
.hh-navbar-logo small { font-size: 11px; font-weight: 400; letter-spacing: 0.12em; color: rgba(230,224,210,0.6); margin-left: -2px; }
.hh-navbar-links { display: flex; list-style: none; gap: 2px; margin: 0; padding: 0; }
.hh-navbar-links a {
  display: inline-block; white-space: nowrap;
  font-size: 13px; font-weight: 500; color: rgba(230,224,210,0.78);
  text-decoration: none; padding: 8px 12px; border-radius: 2px;
  transition: color 150ms, background 150ms;
}
.hh-navbar-links a:hover { color: #FFFDF6; background: rgba(230,224,210,0.08); }
.hh-navbar-links a.active { color: #F1E2B4; box-shadow: inset 0 -2px 0 #B23A44; }
.hh-navbar-search { flex: 1; display: flex; justify-content: flex-end; align-items: center; }
.hh-search-inner { position: relative; display: inline-flex; align-items: center; }
.hh-search-icon { position: absolute; left: 13px; pointer-events: none; color: #CFA94E; display: flex; align-items: center; }
.hh-navbar-search input {
  font-family: inherit; font-size: 12px; color: #FFFDF6;
  background: rgba(230,224,210,0.06);
  border: 1px solid rgba(207,169,78,0.35); border-radius: 2px;
  padding: 7px 18px 7px 34px; outline: none; width: clamp(130px,20vw,200px);
  transition: border-color .2s, background .2s;
}
.hh-navbar-search input::placeholder { color: rgba(230,224,210,0.55); }
.hh-navbar-search input:focus { background: rgba(230,224,210,0.1); border-color: #CFA94E; }
.hh-user-area { display: flex; align-items: center; flex-shrink: 0; margin-left: 4px; }
.hh-login-btn {
  font-size: 12px; font-weight: 500; color: #FFF6E6; letter-spacing: 0.04em;
  text-decoration: none; padding: 7px 16px; white-space: nowrap;
  background: #B23A44; border: 1px solid #CFA94E; border-radius: 2px;
  transition: background .15s;
}
.hh-login-btn:hover { background: #952F39; }
.hh-user-btn {
  display: flex; align-items: center; gap: 7px;
  text-decoration: none; padding: 4px 10px 4px 4px;
  border-radius: 2px; border: 1px solid rgba(207,169,78,0.35);
  transition: background .15s, border-color .15s; max-width: 160px;
}
.hh-user-btn:hover { background: rgba(230,224,210,0.08); border-color: #CFA94E; }
.hh-avatar {
  width: 26px; height: 26px; border-radius: 2px;
  background: #B23A44; box-shadow: inset 0 0 0 1px #CFA94E;
  color: #F1E2B4; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.hh-user-nick { font-size: 12px; font-weight: 500; color: rgba(230,224,210,0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hh-hamburger {
  display: none; flex-shrink: 0; margin-left: 4px;
  background: none; border: none; cursor: pointer;
  width: 44px; height: 44px; border-radius: 2px;
  align-items: center; justify-content: center;
  color: #F1E2B4; transition: background .15s;
}
.hh-hamburger:hover { background: rgba(230,224,210,0.08); }
.hh-mobile-menu {
  position: fixed; top: 56px; left: 0; right: 0; z-index: 499;
  background: rgba(15,20,27,0.98); backdrop-filter: blur(20px);
  border-bottom: 2px solid #B23A44;
  padding: 8px 12px 14px; display: none; flex-direction: column;
  box-shadow: 0 12px 32px rgba(0,0,0,0.35);
}
.hh-mobile-menu.open { display: flex; }
.hh-mm-item {
  font-size: 15px; font-weight: 500; color: rgba(230,224,210,0.82);
  text-decoration: none; padding: 11px 14px; border-radius: 2px;
  display: flex; align-items: center; gap: 10px;
  transition: color .15s, background .15s;
  background: none; border: none; cursor: pointer; width: 100%; text-align: left; font-family: inherit;
}
.hh-mm-item:hover  { color: #FFFDF6; background: rgba(230,224,210,0.07); }
.hh-mm-item.active { color: #F1E2B4; font-weight: 700; box-shadow: inset 3px 0 0 #B23A44; }
.hh-mm-divider { border: none; border-top: 1px solid rgba(207,169,78,0.2); margin: 6px 0; }
.hh-mm-logout {
  font-size: 13px; color: rgba(230,224,210,0.6); padding: 8px 14px; border-radius: 2px;
  background: none; border: none; cursor: pointer; width: 100%; text-align: left;
  transition: color .15s, background .15s;
}
.hh-mm-logout:hover { color: #E8A3A3; background: rgba(178,58,68,0.12); }
.hh-view-btn, .hh-lang-btn {
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  font-family: inherit; font-size: 12px; font-weight: 500; color: rgba(230,224,210,0.85);
  background: none; border: 1px solid rgba(207,169,78,0.35);
  border-radius: 2px; padding: 6px 11px; cursor: pointer; white-space: nowrap;
  transition: background .15s, border-color .15s, color .15s;
}
.hh-view-btn:hover, .hh-lang-btn:hover { background: rgba(230,224,210,0.08); border-color: #CFA94E; color: #FFFDF6; }
.hh-view-btn svg, .hh-mm-item svg { flex-shrink: 0; }
.hh-lang-wrap { position: relative; flex-shrink: 0; }
.hh-lang-btn svg { flex-shrink: 0; transition: transform .2s; }
.hh-lang-btn.open svg { transform: rotate(180deg); }
.hh-lang-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #151C25; border: 1px solid rgba(207,169,78,0.4); border-radius: 2px;
  box-shadow: 0 10px 32px rgba(0,0,0,0.4);
  min-width: 120px; overflow: hidden;
  opacity: 0; transform: translateY(-6px); pointer-events: none;
  transition: opacity .18s, transform .18s; z-index: 600;
}
.hh-lang-dropdown.open { opacity: 1; transform: translateY(0); pointer-events: auto; }
.hh-lang-opt {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500; color: rgba(230,224,210,0.82);
  padding: 10px 16px; cursor: pointer; font-family: inherit;
  transition: color .13s, background .13s;
  border: none; background: none; width: 100%; text-align: left;
}
.hh-lang-opt:hover { color: #FFFDF6; background: rgba(230,224,210,0.07); }
.hh-lang-opt.selected { color: #F1E2B4; font-weight: 700; }
.hh-mm-lang-row { display: flex; gap: 6px; padding: 8px 10px; flex-wrap: wrap; }
.hh-mm-lang-chip {
  font-size: 13px; font-weight: 500; color: rgba(230,224,210,0.8); font-family: inherit;
  border: 1px solid rgba(207,169,78,0.35); border-radius: 2px;
  padding: 5px 14px; cursor: pointer; background: none;
  transition: color .13s, background .13s, border-color .13s;
}
.hh-mm-lang-chip:hover { color: #FFFDF6; background: rgba(230,224,210,0.07); }
.hh-mm-lang-chip.selected { color: #F1E2B4; background: rgba(178,58,68,0.35); border-color: #CFA94E; font-weight: 700; }
@media (max-width: 960px) {
  .hh-navbar-search { display: none; }
  .hh-navbar-links { margin-right: auto; }
}
@media (max-width: 1100px) {
  .hh-view-txt { display: none; }
  .hh-view-btn { padding: 6px 9px; }
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
  <a href="/" class="hh-navbar-logo" aria-label="Travel HUIHUI 홈"><img src="/assets/brand/hui-glyph.svg" alt="" width="26" height="26"/>HUIHUI<small>喜喜 여행</small></a>
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
