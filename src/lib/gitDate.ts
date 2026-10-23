import { execFileSync } from 'node:child_process';
import { relative, resolve } from 'node:path';

/**
 * 파일의 처음·마지막 커밋 날짜(YYYY-MM-DD, 한국 시간). 코스 수정일·sitemap lastmod에 쓴다.
 * 저장소 기록을 한 번만 읽어 모든 파일의 날짜를 모아 둔다.
 * 배포 워크플로는 fetch-depth: 0으로 전체 기록을 받아야 날짜가 맞다. 얕은 클론이면 GitHub Actions에서는 빌드를 멈추고,
 * 그 밖의 환경(Vercel 리다이렉트 배포 등)에서는 경고만 남긴다. 커밋 전 새 파일이나 git이 없는 환경이면 오늘 날짜를 돌려준다.
 */
const kstFormat = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' });
const kstDate = (d: Date) => kstFormat.format(d);

/** 오늘 날짜(한국 시간, YYYY-MM-DD) */
export const todayKst = () => kstDate(new Date());

const git = (args: string[]) => execFileSync('git', ['-c', 'core.quotePath=false', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

interface Repo {
  root: string;
  /** 저장소 루트 기준 경로 → 처음·마지막 커밋 날짜 */
  files: Map<string, { created: string; modified: string }>;
}
let repo: Repo | null = null;

function loadRepo(): Repo {
  if (repo) return repo;
  repo = { root: process.cwd(), files: new Map() };
  try {
    const [root, shallow] = git(['rev-parse', '--show-toplevel', '--is-shallow-repository']).trim().split('\n');
    repo.root = root;
    if (shallow === 'true') {
      const msg = 'git 기록이 얕은 클론이라 코스 날짜가 틀립니다. checkout에 fetch-depth: 0을 주세요.';
      if (process.env.GITHUB_ACTIONS === 'true') throw new Error(msg);
      console.warn(`[gitDate] ${msg}`);
    }
  } catch (e) {
    if (process.env.GITHUB_ACTIONS === 'true') throw e;
    return repo;
  }
  /* 최신 커밋부터 나오므로 처음 본 날짜가 modified, 마지막에 본 날짜가 created */
  let date = '';
  for (const line of git(['log', '--format=%x01%ct', '--name-only']).split('\n')) {
    if (line.startsWith('\x01')) date = kstDate(new Date(Number(line.slice(1)) * 1000));
    else if (line) {
      const hit = repo.files.get(line);
      if (hit) hit.created = date;
      else repo.files.set(line, { created: date, modified: date });
    }
  }
  return repo;
}

const datesOf = (file: string) => {
  const { root, files } = loadRepo();
  return files.get(relative(root, resolve(file)).replaceAll('\\', '/'));
};

export function gitDates(file: string): { created: string; modified: string } {
  const today = todayKst();
  return datesOf(file) ?? { created: today, modified: today };
}

/** 여러 파일 중 가장 최근에 바뀐 날짜. 기록이 하나도 없으면 오늘 */
export function lastChanged(...files: string[]): string {
  return files.map((f) => datesOf(f)?.modified).filter(Boolean).sort().at(-1) ?? todayKst();
}
