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
  return matches.map(m => m[1]).join('\n');
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
  if (hasVueTemplate) {
    // body를 프론트매터 raw 문자열로 보내고 set:html로 렌더링
    const escaped = body.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    out = `---
import BaseLayout from '${relLayout}';
import Navbar from '${relNavbar}';
${hasFooter ? `import Footer from '${relFooter}';` : ''}
const _body = \`${escaped}\`;
---
<BaseLayout title="${title}">
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
