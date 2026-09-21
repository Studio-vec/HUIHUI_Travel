import type { APIRoute } from 'astro';
import type { TripData } from '../lib/tripData';

const tripModules = import.meta.glob('/trips/data/*.json', { eager: true }) as Record<
  string,
  { default: TripData }
>;

/** 색인 대상 페이지. 로그인 등 기능성 페이지(noindex)는 제외한다. */
const staticPaths: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/gallery', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/game', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
];

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('sitemap.xml을 만들려면 astro.config.mjs의 `site`에 실제 도메인을 설정해야 합니다.');
  }

  const today = new Date().toISOString().slice(0, 10);

  const tripPaths = Object.values(tripModules)
    .map((mod) => mod.default)
  .filter((t) => !t.secretCode)
    .sort((a, b) => (a.no ?? 0) - (b.no ?? 0))
    .map((t) => ({ path: `/trips/${t.id}`, priority: '0.9', changefreq: 'monthly' }));

  const urls = [...staticPaths, ...tripPaths]
    .map(({ path, priority, changefreq }) => {
      const loc = new URL(path, site).href;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
