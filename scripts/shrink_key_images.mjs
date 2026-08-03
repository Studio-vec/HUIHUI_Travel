/**
 * 열쇠 이미지 용량 정리 스크립트
 *
 * public/assets/keys/*.png 중 1MB를 넘는 파일만 골라
 * 기존 열쇠 이미지 규격(가로 600px)에 맞춰 리사이즈·재압축한다.
 * 1MB 이하 파일은 건드리지 않고, 줄여도 1MB를 못 맞추면 원본을 그대로 둔다.
 *
 *   node scripts/shrink_key_images.mjs
 *
 * sharp는 astro의 전이 의존성으로 node_modules에 들어있는 것을 사용한다.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DIR = 'public/assets/keys';
const LIMIT = 1024 * 1024;
const TARGET_W = 600; // 기존 열쇠 이미지들이 485~597px 폭

const mb = (n) => (n / 1048576).toFixed(2) + 'MB';

for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith('.png')) continue;

  const p = path.join(DIR, file);
  const before = fs.statSync(p).size;
  if (before <= LIMIT) {
    console.log(`skip  ${file.padEnd(16)} ${mb(before)} (이미 1MB 이하)`);
    continue;
  }

  const src = fs.readFileSync(p);
  const meta = await sharp(src).metadata();

  // 1차: 리사이즈만 (풀컬러 유지)
  let out = await sharp(src)
    .resize({ width: TARGET_W, withoutEnlargement: true })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
  let mode = 'resize';

  // 2차: 그래도 넘치면 팔레트 양자화까지
  if (out.length > LIMIT) {
    out = await sharp(src)
      .resize({ width: TARGET_W, withoutEnlargement: true })
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 90, dither: 1 })
      .toBuffer();
    mode = 'resize+palette';
  }

  if (out.length > LIMIT) {
    console.log(`FAIL  ${file.padEnd(16)} ${mb(out.length)} — 원본 유지`);
    continue;
  }

  const outMeta = await sharp(out).metadata();
  fs.writeFileSync(p, out);
  console.log(
    `ok    ${file.padEnd(16)} ${mb(before)} -> ${mb(out.length)}  ` +
      `${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}  ` +
      `alpha:${outMeta.hasAlpha}  [${mode}]`
  );
}
