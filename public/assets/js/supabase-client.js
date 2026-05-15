if (!window._sb && typeof supabase !== 'undefined') {
  const SUPABASE_URL      = 'https://ojettldqwtwxemzfzfvc.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_hYLRjzsadwOrcCqCwXM-5w_zveEtlol';

  window._sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      flowType: 'implicit',   /* Tracking Prevention 우회 — PKCE localStorage 불필요 */
      persistSession: true,
      detectSessionInUrl: true,
    }
  });
} else if (!window._sb) {
  console.warn('Supabase CDN이 로드되지 않았습니다. CDN 스크립트를 먼저 추가하세요.');
}
