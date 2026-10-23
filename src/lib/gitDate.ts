import { execFileSync } from 'node:child_process';

/**
 * 파일의 처음·마지막 커밋 날짜(YYYY-MM-DD). 코스 수정일·sitemap lastmod에 쓴다.
 * 배포 워크플로는 fetch-depth: 0으로 전체 기록을 받아야 날짜가 맞다.
 * 커밋 전 새 파일이나 git이 없는 환경이면 오늘 날짜를 돌려준다.
 */
const cache = new Map<string, { created: string; modified: string }>();

export function gitDates(file: string): { created: string; modified: string } {
  const hit = cache.get(file);
  if (hit) return hit;
  const today = new Date().toISOString().slice(0, 10);
  let dates: string[] = [];
  try {
    dates = execFileSync('git', ['log', '--follow', '--format=%cs', '--', file], { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  } catch (_) {}
  const result = { created: dates.at(-1) ?? today, modified: dates[0] ?? today };
  cache.set(file, result);
  return result;
}

export const tripDataFile = (id: string) => `trips/data/${id}.json`;
