import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/**
 * public/ 정적 파일 URL에 내용 해시를 붙인다. 예: asset('/assets/css/tokens.css') → '/assets/css/tokens.css?v=1a2b3c4d5e'
 *
 * 파일명이 그대로면 GitHub Pages CDN·브라우저 캐시가 수정 전 CSS/JS를 계속 내려줄 수 있으므로,
 * 내용이 바뀌면 URL도 바뀌게 한다.
 */
export function asset(path: string): string {
  const hash = createHash('sha256')
    .update(readFileSync(join(process.cwd(), 'public', path)))
    .digest('hex')
    .slice(0, 10);
  return `${path}?v=${hash}`;
}
