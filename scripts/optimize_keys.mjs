/**
 * 열쇠 이미지 WebP 생성 스크립트
 *
 * public/assets/keys/<id>.png(원본) → public/assets/keys/<id>.webp(사이트에서 실제로 쓰는 파일)
 * 알파 채널은 유지하고, 가로 520px 이하로 맞춘다. PNG 원본은 그대로 둔다.
 *
 * `npm run dev` / `npm run build` 앞에서 자동으로 실행된다(predev / prebuild).
 * 새 열쇠는 기존처럼 <id>.png만 넣으면 된다.
 *
 * sharp는 astro의 전이 의존성으로 node_modules에 들어있는 것을 사용한다.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DIR = 'public/assets/keys';
const MAX_W = 520; // 화면 표시 최대 폭(≈260px)의 2배
const kb = (n) => (n / 1024).toFixed(0) + 'KB';

let total = 0;
for (const file of fs.readdirSync(DIR).sort()) {
  if (!file.endsWith('.png')) continue;
  const src = path.join(DIR, file);
  const out = path.join(DIR, file.replace(/\.png$/, '.webp'));

  const buf = await sharp(src)
    .resize({ width: MAX_W, withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 92, effort: 5 })
    .toBuffer();
  // 내용이 같으면 다시 쓰지 않는다(불필요한 git 변경 방지)
  if (!fs.existsSync(out) || !fs.readFileSync(out).equals(buf)) fs.writeFileSync(out, buf);
  total += buf.length;
  console.log(`webp  ${file.padEnd(18)} ${kb(fs.statSync(src).size).padStart(7)} -> ${kb(buf.length).padStart(6)}`);
}
console.log(`keys total: ${kb(total)}`);
