/**
 * update-trips.js
 *
 * trips/ 폴더를 스캔해서 index.html 안의 TRIPS 배열을 자동으로 업데이트합니다.
 *
 * 각 html 파일 상단에 아래 메타 주석을 넣으면
 * 날짜 / 설명 / 태그 / 컬러 정보가 자동으로 읽힙니다.
 *
 * <!-- TRIP
 *   date:   2025.05
 *   desc:   쌀밥과 도자기, 황금빛 들판의 도시
 *   tag:    경기도
 *   accent: #A67C52
 * -->
 */

const fs   = require('fs');
const path = require('path');

const TRIPS_DIR  = path.join(__dirname, '../../trips');
const INDEX_PATH = path.join(__dirname, '../../index.html');

/* ─ trips/ 폴더 스캔 ─ */
function scanTrips() {
  if (!fs.existsSync(TRIPS_DIR)) {
    console.log('trips/ 폴더가 없습니다. 빈 목록으로 업데이트합니다.');
    return [];
  }

  return fs
    .readdirSync(TRIPS_DIR)
    .filter(f => f.endsWith('.html'))
    .sort()
    .map(filename => {
      const name    = filename.replace('.html', '');
      const content = fs.readFileSync(path.join(TRIPS_DIR, filename), 'utf-8');
      const meta    = parseMeta(content);

      return {
        file:   `trips/${filename}`,
        name,
        date:   meta.date   || '',
        desc:   meta.desc   || '',
        tag:    meta.tag    || '',
        accent: meta.accent || '#888888',
      };
    });
}

/* ─ html 파일 상단의 TRIP 메타 주석 파싱 ─ */
function parseMeta(html) {
  const block = html.match(/<!--\s*TRIP([\s\S]*?)-->/);
  if (!block) return {};

  const result = {};
  const lines  = block[1].split('\n');

  lines.forEach(line => {
    const m = line.match(/^\s*([\w]+)\s*:\s*(.+?)\s*$/);
    if (m) result[m[1]] = m[2];
  });

  return result;
}

/* ─ index.html 안의 TRIPS 배열 교체 ─ */
function updateIndex(trips) {
  let html = fs.readFileSync(INDEX_PATH, 'utf-8');

  /* const TRIPS = [ ... ]; 블록을 통째로 교체 */
  const tripsJson = JSON.stringify(trips, null, 2)
    .replace(/^/gm, '  ')         /* 들여쓰기 */
    .replace(/^\s{2}\[/, '[')     /* 첫 줄 */
    .replace(/^\s{2}\]$/m, ']');  /* 마지막 줄 */

  const newBlock = `const TRIPS = ${tripsJson};`;

  /* 기존 블록 정규식 — 주석 포함 통째로 */
  const pattern = /\/\*[\s\S]*?═+[\s\S]*?═+\s*\*\/\s*const TRIPS\s*=\s*\[[\s\S]*?\];/;

  if (pattern.test(html)) {
    html = html.replace(pattern, newBlock);
  } else {
    /* fallback: const TRIPS = [...]; 만 교체 */
    html = html.replace(/const TRIPS\s*=\s*\[[\s\S]*?\];/, newBlock);
  }

  fs.writeFileSync(INDEX_PATH, html, 'utf-8');
  console.log(`✅ index.html 업데이트 완료 — 여행지 ${trips.length}곳`);
  trips.forEach(t => console.log(`   • ${t.name}  (${t.date})`));
}

/* ─ 실행 ─ */
const trips = scanTrips();
updateIndex(trips);
