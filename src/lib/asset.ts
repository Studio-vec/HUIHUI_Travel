import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/**
 * public/ 정적 파일 URL에 내용 해시를 붙인다. 예: asset('/assets/css/tokens.css') → '/assets/css/tokens.css?v=1a2b3c4d5e'
 *
 * Vercel은 /assets/* 를 `max-age=31536000, immutable`로 내려보낸다. 파일명이 그대로면
 * 한 번 방문한 브라우저가 수정 전 CSS/JS를 1년간 계속 쓰므로, 내용이 바뀌면 URL도 바뀌게 한다.
 */
export function asset(path: string): string {
  const hash = createHash('sha256')
    .update(readFileSync(join(process.cwd(), 'public', path)))
    .digest('hex')
    .slice(0, 10);
  return `${path}?v=${hash}`;
}
