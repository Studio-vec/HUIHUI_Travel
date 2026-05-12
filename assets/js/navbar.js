/**
 * HUIHUI Travel — 공유 네브바 컴포넌트
 * 모든 페이지에서 <script src="...navbar.js"></script> 한 줄로 삽입됩니다.
 * 이 파일 하나만 수정하면 전 페이지에 즉시 반영됩니다.
 */
(function () {
  'use strict';

  /* ── 경로 감지 ─────────────────────────────────────────────
     trips/ 하위 페이지인지 확인해 상대경로를 자동 조정합니다. */
  const inTrips = /\/trips\/[^/]*$/.test(window.location.pathname);
  const base    = inTrips ? '../' : '';
  const page    = window.location.pathname.split('/').pop() || 'index.html';
  const BLOG    = 'https://blog.naver.com/kty1297';

  /* ── CSS 주입 ─────────────────────────────────────────────
     literal 값을 사용해 tokens.css / trip.css 의존 없이 동작합니다. */
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
.hh-hamburger {
  display: none; flex-shrink: 0; margin-left: auto;
  background: none; border: none; cursor: pointer;
  width: 36px; height: 36px; border-radius: 10px;
  align-items: center; justify-content: center;
  color: #8B6FD0; transition: background .15s;
}
.hh-hamburger:hover { background: rgba(139,111,208,0.08); }
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
@media (max-width: 767px) {
  .hh-navbar-links  { display: none !important; }
  .hh-hamburger     { display: flex !important; }
  .hh-navbar-search { display: none; }
}`;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── 네브바 HTML ─────────────────────────────────────────── */
  const galleryActive = page === 'gallery.html' ? ' class="active"' : '';
  const gameActive    = page === 'game.html'    ? ' class="active"' : '';

  const nav = document.createElement('nav');
  nav.className = 'hh-navbar';
  nav.innerHTML = `
  <a href="${base}index.html" class="hh-navbar-logo">HUIHUI Travel</a>
  <ul class="hh-navbar-links">
    <li><a href="${BLOG}" target="_blank" rel="noopener">블로그</a></li>
    <li><a href="${base}gallery.html"${galleryActive}>갤러리</a></li>
    <li><a href="${base}game.html"${gameActive}>게임</a></li>
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
  <a class="hh-mm-item" href="${BLOG}" target="_blank" rel="noopener">블로그</a>
  <a class="hh-mm-item${page === 'gallery.html' ? ' active' : ''}" href="${base}gallery.html">갤러리</a>
  <a class="hh-mm-item${page === 'game.html'    ? ' active' : ''}" href="${base}game.html">게임</a>`;

  /* ── 삽입: 스크립트 태그 위치에 그대로 끼워넣기 ─────────── */
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
  // 갤러리 페이지: 타이핑 즉시 필터 / 다른 페이지: Enter로 갤러리 이동
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
})();
