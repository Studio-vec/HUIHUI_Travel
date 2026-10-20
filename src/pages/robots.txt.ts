import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = site ? `Sitemap: ${new URL('/sitemap.xml', site).href}\n` : '';

  const body = `User-agent: *
Allow: /
Disallow: /auth/

# AdSense 크롤러
User-agent: Mediapartners-Google
Allow: /

# AI 학습용 수집은 거절한다 (검색 노출·애드센스와는 무관한 로봇들).
# ChatGPT-User·OAI-SearchBot·PerplexityBot 같은 AI 검색 답변용 로봇은 막지 않는다
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: CCBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: meta-externalagent
User-agent: FacebookBot
User-agent: Bytespider
User-agent: cohere-training-data-crawler
User-agent: AI2Bot
User-agent: Ai2Bot-Dolma
User-agent: ImagesiftBot
User-agent: PanguBot
User-agent: Diffbot
User-agent: omgili
User-agent: Timpibot
Disallow: /

${sitemap}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
