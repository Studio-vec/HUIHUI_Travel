/**
 * 비밀코드 → secretHash 계산. 사용법: node scripts/secret_hash.mjs "코드"
 *
 * 나온 값을 trips/data/<여행지>.json 의 "secretHash"에 넣는다. 코드 원문은 저장소에 두지 않는다.
 * 페이지는 /trips/<해시 앞 24자> 에 만들어지고, 홈의 비밀코드 입력창이 같은 방식으로 해시해 그 주소를 찾아간다.
 * 정규화 규칙(앞뒤·중간 공백 제거 + 소문자)은 src/pages/index.astro 의 _hashSecret 과 같아야 한다.
 */
import { createHash } from 'node:crypto';

const code = process.argv[2];
if (!code) {
  console.error('사용법: node scripts/secret_hash.mjs "코드"');
  process.exit(1);
}
const norm = code.trim().toLowerCase().replace(/\s+/g, '');
const hash = createHash('sha256').update('travel-huihui-secret:' + norm).digest('hex');
console.log(`secretHash: ${hash}`);
console.log(`페이지 주소: /trips/${hash.slice(0, 24)}`);
