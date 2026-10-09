/**
 * 파비콘 생성 스크립트 (한 번 실행해서 결과물을 커밋한다)
 *
 * 홈 화면 오른쪽 아래 종 버튼과 같은 모양: bell-up.svg(종 윗부분)를 bell-down.svg(받침) 위에 겹쳐 올린다.
 * 버튼 CSS의 `.bell-img-down { margin-top: -6% }`와 같은 비율로 겹친다.
 *
 * 출력 (public/):
 *   favicon.ico          16·32·48px PNG를 담은 ICO (브라우저가 기본으로 요청하는 경로)
 *   favicon-32.png       <link rel="icon">
 *   icon-192.png         안드로이드 홈 화면 등 큰 아이콘
 *   apple-touch-icon.png 180px, iOS는 투명 영역을 검게 칠하므로 흰 배경 + 여백
 *
 * 실행: node scripts/make_favicon.mjs
 */
import sharp from 'sharp';
import fs from 'fs';

const W = 1024; // 합성 작업 해상도
const up = await sharp('public/assets/bell-up.svg', { density: 300 }).resize({ width: W }).png().toBuffer();
const down = await sharp('public/assets/bell-down.svg', { density: 300 }).resize({ width: W }).png().toBuffer();
const upH = (await sharp(up).metadata()).height;
const downH = (await sharp(down).metadata()).height;
const overlap = Math.round(W * 0.06);

const stacked = await sharp({
  create: { width: W, height: upH + downH - overlap, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    { input: down, top: upH - overlap, left: 0 },
    { input: up, top: 0, left: 0 },
  ])
  .png()
  .toBuffer();

/* 투명 여백을 잘라낸 뒤 정사각형 캔버스 가운데에 놓는다 */
const bell = await sharp(stacked).trim().png().toBuffer();

async function square(size, { pad = 0.04, bg = { r: 0, g: 0, b: 0, alpha: 0 } } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const fitted = await sharp(bell).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
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

const icoImages = [];
for (const size of [16, 32, 48]) icoImages.push({ size, data: await square(size, { pad: 0.02 }) });
fs.writeFileSync('public/favicon.ico', ico(icoImages));
fs.writeFileSync('public/favicon-32.png', await square(32, { pad: 0.02 }));
fs.writeFileSync('public/icon-192.png', await square(192));
fs.writeFileSync('public/apple-touch-icon.png', await square(180, { pad: 0.14, bg: { r: 255, g: 255, b: 255, alpha: 1 } }));

console.log('favicon: favicon.ico, favicon-32.png, icon-192.png, apple-touch-icon.png');
