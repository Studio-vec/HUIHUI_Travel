import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = site ? `Sitemap: ${new URL('/sitemap.xml', site).href}\n` : '';

  const body = `User-agent: *
Allow: /
Disallow: /auth/

# AdSense 크롤러
User-agent: Mediapartners-Google
Allow: /

${sitemap}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
