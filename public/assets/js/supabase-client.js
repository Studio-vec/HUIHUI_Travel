(function () {
  if (window._sb) return;               /* 이미 초기화됐으면 스킵 */
  if (typeof supabase === 'undefined') {
    console.warn('Supabase CDN이 로드되지 않았습니다.');
    return;
  }
  window._sb = supabase.createClient(
    'https://ojettldqwtwxemzfzfvc.supabase.co',
    'sb_publishable_hYLRjzsadwOrcCqCwXM-5w_zveEtlol',
    {
      auth: {
        flowType: 'implicit',
        persistSession: true,
        detectSessionInUrl: true,
      }
    }
  );
})();
