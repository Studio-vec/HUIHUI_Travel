import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAGES = join(ROOT, 'src', 'pages');

function extractTitle(html) {
  const m = html.match(/<title>(.*?)<\/title>/);
  return m ? m[1] : 'HUIHUI Travel';
}

function extractHeadStyles(html) {
  const matches = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];
  let combined = matches.map(m => m[1]).join('\n');
  // 구 navbar CSS 제거 (navbar.js가 .hh-navbar* 로 대체)
  combined = combined.replace(/\/\*[^*]*NAVBAR[\s\S]*?(?=\/\*[^*]*(?:HERO|FOOTER|$))/i, '');
  return combined;
}

function extractHeadStyleLinks(html) {
  const headM = html.match(/<head>([\s\S]*?)<\/head>/);
  if (!headM) return [];
  const links = [...headM[1].matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/g)];
  return links
    .map(m => m[0])
    .filter(tag => /assets\/css\//.test(tag))
    .map(tag => tag.replace(/href=["'](?:\.\.\/)?assets\//, 'href="/assets/'));
}

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  return m ? m[1] : '';
}

function extractHeadInlineScripts(html) {
  const headM = html.match(/<head>([\s\S]*?)<\/head>/);
  if (!headM) return '';
  const head = headM[1];
  const matches = [...head.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)];
  return matches.map(m => m[1]).filter(s => s.trim()).join('\n');
}

function convert(srcPath, destPath, depth) {
  if (!existsSync(srcPath)) { console.log(`  ✗ not found: ${srcPath}`); return; }

  let html = readFileSync(srcPath, 'utf-8').replace(/^﻿/, ''); // strip BOM

  const title = extractTitle(html);
  const styles = extractHeadStyles(html);
  const headScripts = extractHeadInlineScripts(html);
  const headLinks = extractHeadStyleLinks(html);
  let body = extractBody(html);

  // assets 경로를 절대경로로 통일
  body = body.replace(/(src|href)=["'](?:\.\.\/)?assets\//g, '$1="/assets/');

  // body 내 <script src> 태그에 is:inline 추가 (Astro가 번들링 시도를 하지 않도록)
  body = body.replace(/<script(\s+[^>]*src=["'][^"']+["'][^>]*)>/g, (match, attrs) => {
    if (attrs.includes('is:inline')) return match;
    return `<script${attrs} is:inline>`;
  });

  // navbar.js 스크립트 태그 제거
  body = body.replace(/\s*<script[^>]*navbar\.js[^>]*><\/script>/g, '');

  // auth 페이지 redirect: ../index.html → /
  body = body.replace(/(['"`])\.\.\/index\.html\1/g, "$1/$1");
  // reset-password 이메일 redirectTo URL: .html 확장자 제거
  body = body.replace(/(redirectTo:\s*['"`][^'"`]*\/auth\/reset-password)\.html(['"`])/g, '$1$2');

  // 상대 href → Astro 클린 URL 절대경로
  body = body.replace(/href=["'](?:\.\.\/)?trips\/([^"'.]+)(?:\.html)?["']/g, 'href="/trips/$1"');
  body = body.replace(/href=["'](?:\.\.\/)?auth\/([^"'.]+)(?:\.html)?["']/g, 'href="/auth/$1"');
  body = body.replace(/href=["'](?:\.\.\/)?index\.html["']/g, 'href="/"');
  body = body.replace(/href=["'](?:\.\.\/)?gallery(?:\.html)?["']/g, 'href="/gallery"');
  body = body.replace(/href=["'](?:\.\.\/)?game(?:\.html)?["']/g, 'href="/game"');

  const up = '../'.repeat(depth);
  const relLayout = `${up}../layouts/BaseLayout.astro`;
  const relNavbar  = `${up}../components/Navbar.astro`;
  const relFooter  = `${up}../components/Footer.astro`;
  const hasFooter = html.includes('<footer');

  // Vue 템플릿 {{ }} 이 있으면 Astro가 JSX 표현식으로 오파싱 → set:html 사용
  const hasVueTemplate = body.includes('{{');

  let out;
  const headLinkTags = headLinks.map(l => `  ${l}`).join('\n');

  if (hasVueTemplate) {
    const escaped = body.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    out = `---
import BaseLayout from '${relLayout}';
import Navbar from '${relNavbar}';
${hasFooter ? `import Footer from '${relFooter}';` : ''}
const _body = \`${escaped}\`;
---
<BaseLayout title="${title}">
${headLinkTags ? `  <Fragment slot="head">\n${headLinkTags}\n  </Fragment>` : ''}
  <Navbar />
  <Fragment set:html={_body} />
${hasFooter ? '  <Footer />' : ''}
${styles.trim() ? `\n<style is:global>\n${styles}\n</style>` : ''}
${headScripts.trim() ? `\n<script is:inline>\n${headScripts}\n</script>` : ''}
</BaseLayout>
`;
  } else {
    out = `---
import BaseLayout from '${relLayout}';
import Navbar from '${relNavbar}';
${hasFooter ? `import Footer from '${relFooter}';` : ''}
---
<BaseLayout title="${title}">
${headLinkTags ? `  <Fragment slot="head">\n${headLinkTags}\n  </Fragment>` : ''}
  <Navbar />
${body.trimEnd()}
${hasFooter ? '  <Footer />' : ''}
${styles.trim() ? `\n<style is:global>\n${styles}\n</style>` : ''}
${headScripts.trim() ? `\n<script is:inline>\n${headScripts}\n</script>` : ''}
</BaseLayout>
`;
  }

  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, out, 'utf-8');
  console.log(`  ✓ ${srcPath.replace(ROOT, '')}  →  ${destPath.replace(ROOT, '')}`);
}

const files = [
  ['index.html',                'index.astro',                0],
  ['gallery.html',              'gallery.astro',              0],
  ['game.html',                 'game.astro',                 0],
  ['auth/login.html',           'auth/login.astro',           1],
  ['auth/register.html',        'auth/register.astro',        1],
  ['auth/profile.html',         'auth/profile.astro',         1],
  ['auth/find-account.html',    'auth/find-account.astro',    1],
  ['auth/reset-password.html',  'auth/reset-password.astro',  1],
  ['trips/icheon.html',         'trips/icheon.astro',         1],
  ['trips/daejeon.html',        'trips/daejeon.astro',        1],
  ['trips/dongincheon.html',    'trips/dongincheon.astro',    1],
  ['trips/gangneung.html',      'trips/gangneung.astro',      1],
  ['trips/nowon.html',          'trips/nowon.astro',          1],
  ['trips/paju.html',           'trips/paju.astro',           1],
  ['trips/suwon.html',          'trips/suwon.astro',          1],
  ['trips/yeosu.html',          'trips/yeosu.astro',          1],
];

console.log('Converting HTML → Astro...\n');
for (const [src, dest, depth] of files) {
  convert(join(ROOT, src), join(PAGES, dest), depth);
}
console.log('\n✅ 완료!');
