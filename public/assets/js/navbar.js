/**
 * HUIHUI Travel — 공유 네브바 컴포넌트
 * 모든 페이지에서 <script src="...navbar.js"></script> 한 줄로 삽입됩니다.
 */
(function () {
  'use strict';

  const page    = window.location.pathname.replace(/\/$/, '').split('/').pop() || '';
  const BLOG    = 'https://blog.naver.com/kty1297';

  /* ── CSS ─────────────────────────────────────────────────── */
  const css = `
.hh-navbar {
  position: sticky; top: 0; z-index: 500;
  background: rgba(255,248,235,0.82); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(139,111,208,0.15);
  height: 56px; padding: 0 clamp(20px,5vw,48px);
  display: flex; align-items: center; gap: 24px;
}
.hh-navbar-logo {
  font-family: 'DM Serif Display','Cormorant Garamond',Georgia,serif;
  font-size: 20px; font-style: italic; font-weight: 600;
  color: #8B6FD0; text-decoration: none; flex-shrink: 0;
}
.hh-navbar-links { display: flex; list-style: none; gap: 4px; }
.hh-navbar-links a {
  font-size: 13px; font-weight: 500; color: #6B5E8A;
  text-decoration: none; padding: 8px 12px; border-radius: 10px;
  transition: color 150ms, background 150ms;
}
.hh-navbar-links a:hover,
.hh-navbar-links a.active { color: #8B6FD0; background: rgba(139,111,208,0.08); }
.hh-navbar-search {
  flex: 1; display: flex; justify-content: flex-end; align-items: center;
}
.hh-search-inner { position: relative; display: inline-flex; align-items: center; }
.hh-search-icon {
  position: absolute; left: 13px; pointer-events: none;
  color: #8B6FD0; display: flex; align-items: center;
}
.hh-navbar-search input {
  font-family: inherit; font-size: 12px; color: #6B5E8A;
  background: rgba(255,255,255,0.7); backdrop-filter: blur(8px);
  border: 1px solid rgba(139,111,208,0.25); border-radius: 999px;
  padding: 7px 18px 7px 34px; outline: none; width: clamp(130px,20vw,200px);
  transition: border-color .2s, background .2s;
}
.hh-navbar-search input::placeholder { color: #b0a8c0; }
.hh-navbar-search input:focus {
  background: rgba(255,255,255,0.95); border-color: rgba(139,111,208,0.5);
}
/* ── 유저 영역 ── */
.hh-user-area {
  display: flex; align-items: center; flex-shrink: 0; margin-left: 8px;
}
.hh-login-btn {
  font-size: 12px; font-weight: 600; color: #8B6FD0;
  text-decoration: none; padding: 7px 16px;
  border: 1.5px solid rgba(139,111,208,0.4);
  border-radius: 999px; white-space: nowrap;
  transition: background .15s, border-color .15s;
}
.hh-login-btn:hover { background: rgba(139,111,208,0.08); border-color: rgba(139,111,208,0.7); }
.hh-user-btn {
  display: flex; align-items: center; gap: 7px;
  text-decoration: none; padding: 5px 10px 5px 5px;
  border-radius: 999px; border: 1.5px solid rgba(139,111,208,0.25);
  transition: background .15s, border-color .15s;
  max-width: 160px;
}
.hh-user-btn:hover { background: rgba(139,111,208,0.07); border-color: rgba(139,111,208,0.5); }
.hh-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #C0A8FF, #8B6FD0);
  color: white; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.hh-user-nick {
  font-size: 12px; font-weight: 600; color: #6B5E8A;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
/* ── 햄버거 ── */
.hh-hamburger {
  display: none; flex-shrink: 0; margin-left: 4px;
  background: none; border: none; cursor: pointer;
  width: 36px; height: 36px; border-radius: 10px;
  align-items: center; justify-content: center;
  color: #8B6FD0; transition: background .15s;
}
.hh-hamburger:hover { background: rgba(139,111,208,0.08); }
/* ── 모바일 메뉴 ── */
.hh-mobile-menu {
  position: fixed; top: 56px; left: 0; right: 0; z-index: 499;
  background: rgba(255,248,235,0.97); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139,111,208,0.12);
  padding: 8px 12px 14px; display: none; flex-direction: column;
  box-shadow: 0 8px 32px rgba(80,40,160,0.1);
}
.hh-mobile-menu.open { display: flex; }
.hh-mm-item {
  font-size: 15px; font-weight: 500; color: #6B5E8A;
  text-decoration: none; padding: 11px 14px; border-radius: 12px;
  display: flex; align-items: center; gap: 10px;
  transition: color .15s, background .15s;
  background: none; border: none; cursor: pointer; width: 100%; text-align: left;
}
.hh-mm-item:hover  { color: #8B6FD0; background: rgba(139,111,208,0.08); }
.hh-mm-item.active { color: #8B6FD0; font-weight: 600; }
.hh-mm-divider { border: none; border-top: 1px solid rgba(139,111,208,0.12); margin: 6px 0; }
.hh-mm-logout {
  font-size: 13px; color: #9a8ab0; padding: 8px 14px; border-radius: 12px;
  background: none; border: none; cursor: pointer; width: 100%; text-align: left;
  transition: color .15s, background .15s;
}
.hh-mm-logout:hover { color: #c04040; background: rgba(200,80,80,0.06); }
/* ── 언어 드롭다운 ── */
.hh-lang-wrap {
  position: relative; flex-shrink: 0;
}
.hh-lang-btn {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600; color: #8B6FD0;
  background: none; border: 1.5px solid rgba(139,111,208,0.3);
  border-radius: 999px; padding: 6px 12px; cursor: pointer;
  transition: background .15s, border-color .15s; white-space: nowrap;
}
.hh-lang-btn:hover { background: rgba(139,111,208,0.08); border-color: rgba(139,111,208,0.6); }
.hh-lang-btn svg { flex-shrink: 0; transition: transform .2s; }
.hh-lang-btn.open svg { transform: rotate(180deg); }
.hh-lang-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: rgba(255,248,235,0.98); backdrop-filter: blur(16px);
  border: 1px solid rgba(139,111,208,0.18); border-radius: 14px;
  box-shadow: 0 8px 32px rgba(80,40,160,0.13);
  min-width: 120px; overflow: hidden;
  opacity: 0; transform: translateY(-6px); pointer-events: none;
  transition: opacity .18s, transform .18s;
  z-index: 600;
}
.hh-lang-dropdown.open { opacity: 1; transform: translateY(0); pointer-events: auto; }
.hh-lang-opt {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500; color: #6B5E8A;
  padding: 10px 16px; cursor: pointer;
  transition: color .13s, background .13s;
  border: none; background: none; width: 100%; text-align: left;
}
.hh-lang-opt:hover { color: #8B6FD0; background: rgba(139,111,208,0.08); }
.hh-lang-opt.selected { color: #8B6FD0; font-weight: 700; }
/* 모바일 메뉴 안 언어 선택 */
.hh-mm-lang-row {
  display: flex; gap: 6px; padding: 8px 10px; flex-wrap: wrap;
}
.hh-mm-lang-chip {
  font-size: 13px; font-weight: 500; color: #6B5E8A;
  border: 1.5px solid rgba(139,111,208,0.25); border-radius: 999px;
  padding: 5px 14px; cursor: pointer; background: none;
  transition: color .13s, background .13s, border-color .13s;
}
.hh-mm-lang-chip:hover { color: #8B6FD0; background: rgba(139,111,208,0.08); }
.hh-mm-lang-chip.selected { color: #8B6FD0; background: rgba(139,111,208,0.1); border-color: rgba(139,111,208,0.6); font-weight: 700; }
@media (max-width: 767px) {
  .hh-navbar-links  { display: none !important; }
  .hh-hamburger     { display: flex !important; }
  .hh-navbar-search { display: none; }
  .hh-user-area     { display: none; }
  .hh-lang-wrap     { display: none; }
}`;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── 네브바 HTML ─────────────────────────────────────────── */
  const homeActive    = (page === '' || page === 'index') ? ' class="active"' : '';
  const galleryActive = page === 'gallery' ? ' class="active"' : '';
  const gameActive    = page === 'game'    ? ' class="active"' : '';

  const nav = document.createElement('nav');
  nav.className = 'hh-navbar';
  nav.innerHTML = `
  <a href="/" class="hh-navbar-logo">HUIHUI Travel</a>
  <ul class="hh-navbar-links">
    <li><a href="/"${homeActive}>홈</a></li>
    <li><a href="/gallery"${galleryActive}>갤러리</a></li>
    <li><a href="/game"${gameActive}>짐싸기</a></li>
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
  <button class="hh-hamburger" id="hhHamburger" aria-label="메뉴">
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M1 1.5h18M1 7.5h18M1 13.5h18"/>
    </svg>
  </button>`;

  /* ── 모바일 메뉴 HTML ─────────────────────────────────────── */
  const menu = document.createElement('div');
  menu.className = 'hh-mobile-menu';
  menu.id = 'hhMobileMenu';
  menu.innerHTML = `
  <a class="hh-mm-item${(page === '' || page === 'index') ? ' active' : ''}" href="/">홈</a>
  <a class="hh-mm-item${page === 'gallery' ? ' active' : ''}" href="/gallery">갤러리</a>
  <a class="hh-mm-item${page === 'game'    ? ' active' : ''}" href="/game">짐싸기</a>
  <a class="hh-mm-item" href="${BLOG}" target="_blank" rel="noopener">블로그</a>
  <hr class="hh-mm-divider"/>
  <div class="hh-mm-lang-row" id="hhMobileLangRow"></div>
  <hr class="hh-mm-divider"/>
  <div id="hhMobileUser">
    <a class="hh-mm-item" href="/auth/login">로그인 / 회원가입</a>
  </div>`;

  /* ── 삽입 ─────────────────────────────────────────────────── */
  const script = document.currentScript;
  script.parentNode.insertBefore(nav,  script);
  script.parentNode.insertBefore(menu, script);

  /* ── 이벤트: 햄버거 + 검색 ──────────────────────────────── */
  const hamBtn = nav.querySelector('#hhHamburger');
  hamBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target)) menu.classList.remove('open');
  });

  const si = nav.querySelector('#hhNavSearch');
  si.addEventListener('input', function () {
    if (typeof window.filterBySearch === 'function') window.filterBySearch(si.value);
  });
  si.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !si.value.trim()) return;
    if (typeof window.filterBySearch === 'function') {
      window.filterBySearch(si.value.trim());
    } else {
      window.location.href = base + 'gallery.html?q=' + encodeURIComponent(si.value.trim());
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

        const nick    = profile?.nickname || '사용자';
        const initial = nick.charAt(0).toUpperCase();

        userArea.innerHTML = `
          <a href="/auth/profile" class="hh-user-btn">
            <span class="hh-avatar">${initial}</span>
            <span class="hh-user-nick">${nick}</span>
          </a>`;

        if (mobileUser) {
          mobileUser.innerHTML = `
            <a class="hh-mm-item" href="/auth/profile">
              <span class="hh-avatar" style="width:22px;height:22px;font-size:11px;">${initial}</span>
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
