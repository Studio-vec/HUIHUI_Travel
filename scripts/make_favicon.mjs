/**
 * 파비콘 생성 스크립트 (한 번 실행해서 결과물을 커밋한다)
 *
 * 브랜드 아이콘: 오프화이트 바탕 위 囍 로고 (public/assets/brand/hui-app-icon.svg)
 * 탭 파비콘(16·32·48px)은 바탕 없이 로고 원본만 투명 배경으로 (public/assets/brand/huihui-logo.svg)
 *
 * 출력 (public/):
 *   favicon.svg          탭 파비콘 (크롬·엣지·파이어폭스). 정사각 viewBox, 다크 모드에서는 남색 획을 밝은 색으로
 *   favicon.ico          16·32·48px PNG를 담은 ICO (SVG 미지원 브라우저용, 브라우저가 기본으로 요청하는 경로)
 *   favicon-32.png       <link rel="icon">, SVG 미지원 브라우저용
 *   icon-192.png         안드로이드 홈 화면 아이콘 (site.webmanifest에서만 참조, 탭에는 쓰지 않음)
 *   apple-touch-icon.png 180px, iOS는 투명 영역을 검게 칠하므로 흰 배경 + 여백
 *
 * 실행: node scripts/make_favicon.mjs
 */
import sharp from 'sharp';
import fs from 'fs';

const W = 1024; // 합성 작업 해상도
/* 큰 아이콘은 바탕이 있는 앱 아이콘, 탭 파비콘은 투명 배경의 로고 원본 */
const raster = (path) => sharp(path, { density: 600 }).resize({ width: W }).png().toBuffer();
const appIcon = await raster('public/assets/brand/hui-app-icon.svg');
const logo = await raster('public/assets/brand/huihui-logo.svg');

async function square(size, { icon = appIcon, pad = 0.04, bg = { r: 0, g: 0, b: 0, alpha: 0 } } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const fitted = await sharp(icon).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: fitted, gravity: 'center' }])
    .png()
    .toBuffer();
}

/* PNG 데이터를 그대로 담는 ICO (Windows Vista+ / 모든 최신 브라우저 지원) */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);   // color planes
    e.writeUInt16LE(32, 6);  // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

/* SVG 파비콘: 로고 원본을 정사각 viewBox 가운데에 두고, 다크 모드 탭에서도 보이도록 남색 획만 밝게 바꾼다 */
const logoSvg = fs.readFileSync('public/assets/brand/huihui-logo.svg', 'utf8');
const [, , vw, vh] = logoSvg.match(/viewBox="([^"]+)"/)[1].trim().split(/\s+/).map(Number);
const side = Math.max(vw, vh);
const faviconSvg = logoSvg
  .replace(/viewBox="[^"]+"/, `viewBox="${+((vw - side) / 2).toFixed(3)} ${+((vh - side) / 2).toFixed(3)} ${side} ${side}"`)
  .replace('</style>', '  @media (prefers-color-scheme: dark) { .cls-1 { fill: #F7F0E5; } }\n    </style>');
fs.writeFileSync('public/favicon.svg', faviconSvg);

const icoImages = [];
for (const size of [16, 32, 48]) icoImages.push({ size, data: await square(size, { icon: logo, pad: 0 }) });
fs.writeFileSync('public/favicon.ico', ico(icoImages));
fs.writeFileSync('public/favicon-32.png', await square(32, { icon: logo, pad: 0 }));
fs.writeFileSync('public/icon-192.png', await square(192));
fs.writeFileSync('public/apple-touch-icon.png', await square(180, { pad: 0.14, bg: { r: 255, g: 255, b: 255, alpha: 1 } }));

console.log('favicon: favicon.svg, favicon.ico, favicon-32.png, icon-192.png, apple-touch-icon.png');
