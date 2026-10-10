/**
 * Travel HUIHUI — PC / 모바일 화면 전환
 *
 * - PC에서 '모바일 화면': /m.html 셸에서 같은 페이지를 폰 크기 iframe(미디어쿼리가 그대로 적용됨)에 담아 보여준다.
 * - 폰에서 'PC 화면': viewport를 1280px로 바꿔 PC 레이아웃을 축소해서 보여준다.
 * 선택은 localStorage('hh-view')에 저장되어 다른 페이지에서도 유지된다.
 *
 * BaseLayout <head>에서 동기 스크립트로 가장 먼저 실행된다. 셸(/m.html)에는 광고·앱 스크립트가 없다.
 */
(function () {
  'use strict';

  var KEY = 'hh-view';
  var FRAME_NAME = 'hh-phone';

  var pref = null;
  try { pref = localStorage.getItem(KEY); } catch (e) {}

  var framed = window.name === FRAME_NAME;
  var isPhone = false;
  try {
    isPhone = Math.min(screen.width, screen.height) <= 820 && window.matchMedia('(pointer: coarse)').matches;
  } catch (e) {}

  /* 이미 좁은 데스크톱 창이면 전환할 의미가 없다 (초기 로딩 중 innerWidth가 0일 수 있어 그 경우는 넓은 것으로 취급) */
  var wide = !window.innerWidth || window.innerWidth >= 700;

  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var api = window.hhView = {
    framed: framed,
    isPhone: isPhone,
    pref: pref,
    /* 버튼을 누르면 전환될 화면: 'mobile' | 'desktop' | null(전환 불가) */
    target: framed ? null : (isPhone ? (pref === 'desktop' ? 'mobile' : 'desktop') : (wide ? 'mobile' : null)),
    toggle: function () {
      if (framed || !api.target) return;
      save(api.target);
      location.reload();
    }
  };

  /* ── 폰에서 PC 화면: viewport 확장 ───────────────────────── */
  if (!framed && isPhone && pref === 'desktop') {
    var vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.setAttribute('content', 'width=1280');
    return;
  }

  /* ── 폰 프레임 안: 주소/제목을 바깥 문서에 알려 URL을 맞춘다 ─── */
  if (framed) {
    var post = function () {
      try {
        parent.postMessage({
          hh: 'nav',
          href: location.pathname + location.search + location.hash,
          title: document.title
        }, location.origin);
      } catch (e) {}
    };
    document.addEventListener('DOMContentLoaded', post);
    window.addEventListener('load', post);
    window.addEventListener('hashchange', post);
    window.addEventListener('popstate', post);
    return;
  }

  /* ── PC에서 모바일 화면: 폰 프레임 셸(/m.html)로 이동 ─────── */
  if (!isPhone && pref === 'mobile' && wide) {
    location.replace('/m.html?u=' + encodeURIComponent(location.pathname + location.search + location.hash));
  }
})();
