/**
 * HUIHUI Travel — Supabase 클라이언트
 *
 * 사용법:
 *   1. 아래 두 값을 Supabase 대시보드 > Settings > API 에서 복사해 붙여넣으세요.
 *   2. 이 파일을 Supabase CDN 스크립트 바로 뒤에 로드하세요.
 *      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *      <script src="../assets/js/supabase-client.js"></script>
 */

const SUPABASE_URL      = 'https://ojettldqwtwxemzfzfvc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hYLRjzsadwOrcCqCwXM-5w_zveEtlol';

if (typeof supabase !== 'undefined') {
  window._sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase CDN이 로드되지 않았습니다. CDN 스크립트를 먼저 추가하세요.');
}
