export interface TripPlaceDetail {
  icon: string;
  label: string;
  value: string;
}

export interface TripPlaceTag {
  label: string;
  style: string;
}

export interface TripTransit {
  type: string;
  icon: string;
  desc: string;
}

export interface TripTip {
  id: string;
  author: string;
  avatar: string;
  isOperator: boolean;
  date: string;
  body: string;
  season?: string;
  upvotes: number;
  upvoted?: boolean;
}

export interface TripPlace {
  id: string;
  day: number;
  no: string;
  time: string;
  h: number;
  name: string;
  theme: string;
  theme_id: string;
  tags: TripPlaceTag[];
  tip: string;
  enjoyTip: string;
  /** Blog paragraphs — one string per paragraph, rendered as separate <p> tags */
  desc: string[];
  details: TripPlaceDetail[];
  tips: TripTip[];
  transitTo?: TripTransit;
  /** 정기 휴무 요일 (0=일 … 6=토). 출발일을 고르면 쉬는 곳을 미리 경고하는 데 쓴다 */
  closedDays?: number[];
  /** 매월 마지막 주에만 쉬는 요일 (예: 매월 마지막 주 월요일 → [1]). 출발일 경고에 함께 쓴다 */
  closedLastWeekdays?: number[];
  /** 날짜로 계산할 수 없는 휴무(공휴일 등). 출발일 확인 결과 아래에 늘 함께 보여 준다 */
  closedNote?: string;
}

export interface TripInfoBanner {
  icon?: string;
  title: string;
  text: string;
}

export interface TripData {
  id: string;
  title: string;
  pageTitle: string;
  headerEyebrow: string;
  headerTitleHtml: string;
  locationLabel: string;
  tags: string[];
  meta: string[];
  downloadName?: string;
  infoBanner?: TripInfoBanner;
  operatorNote: { avatar: string; name: string; text: string };
  seedTips: TripTip[];
  places: TripPlace[];
  /**
   * 비밀코드 여행지. 값이 있으면 홈·갤러리·게임·사이트맵 목록에 나오지 않고 검색엔진에도 색인되지 않는다.
   * 코드 원문 대신 `node scripts/secret_hash.mjs "코드"`로 만든 해시를 넣는다.
   * 페이지는 /trips/<id>가 아니라 /trips/<해시 앞 24자>에 만들어져, 코드를 아는 사람만 주소를 알 수 있다.
   */
  secretHash?: string;
  /** Homepage key-card display order (defaults to array order if omitted) */
  no?: number;
  /** Short Korean place name shown on the homepage key card */
  shortNameKo?: string;
  /** Optional short tagline shown on the homepage key card */
  tagline?: string;
}

/** 여행지 페이지 경로의 마지막 조각. 비밀코드 여행지는 id를 드러내지 않도록 해시에서 만든다 */
export function tripSlug(data: TripData): string {
  return data.secretHash ? data.secretHash.slice(0, 24) : data.id;
}

/* 도·시 단위 태그가 제각각이라 필터용 큰 권역으로 묶는다 */
function regionOf(tag: string): string {
  if (/강원/.test(tag)) return '강원';
  if (/서울|경기|인천/.test(tag)) return '수도권';
  if (/대전|세종|충/.test(tag)) return '충청';
  if (/전라|광주|전북|전남/.test(tag)) return '전라';
  if (/경상|부산|대구|울산|경북|경남/.test(tag)) return '경상';
  if (/제주/.test(tag)) return '제주';
  return tag;
}

/** 홈 열쇠 카드에 쓰는 정보. 홈(공개 여행지)과 비밀 여행지 페이지(코드를 연 사람의 홈에 추가)가 함께 쓴다 */
export function homeCardOf(t: TripData, fallbackNo: number) {
  return {
    no: t.no ?? fallbackNo,
    nameKo: t.shortNameKo || t.title,
    tagline: t.tagline || '',
    region: regionOf(t.tags[0] || ''),
    nights: t.tags[t.tags.length - 1] || '',
    theme: String(t.tags[1] || '').replace(/^\P{L}+/u, ''),
    loc: t.locationLabel || '',
  };
}

export function dayCountOf(data: TripData): number {
  return Math.max(...data.places.map((p) => p.day));
}

export interface MobilePlace {
  id: string;
  time: string;
  name: string;
  theme: string;
  theme_id: string;
  tip: string;
  enjoyTip: string;
  photo: null;
  h: number;
  details: TripPlaceDetail[];
  transitTo?: TripTransit;
  closedDays?: number[];
  closedLastWeekdays?: number[];
  closedNote?: string;
}

export function toMobileSchedule(data: TripData): { places: MobilePlace[] }[] {
  const dayCount = Math.max(...data.places.map((p) => p.day));
  const schedule: { places: MobilePlace[] }[] = [];
  for (let day = 1; day <= dayCount; day++) {
    schedule.push({
      places: data.places
        .filter((p) => p.day === day)
        .map((p) => ({
          id: p.id,
          time: p.time,
          name: p.name,
          theme: p.theme,
          theme_id: p.theme_id,
          tip: p.tip,
          enjoyTip: p.enjoyTip,
          photo: null,
          h: p.h,
          details: p.details,
          ...(p.transitTo ? { transitTo: p.transitTo } : {}),
          ...(p.closedDays && p.closedDays.length ? { closedDays: p.closedDays } : {}),
          ...(p.closedLastWeekdays && p.closedLastWeekdays.length ? { closedLastWeekdays: p.closedLastWeekdays } : {}),
          ...(p.closedNote ? { closedNote: p.closedNote } : {}),
        })),
    });
  }
  return schedule;
}

export function toMobileTips(data: TripData): TripTip[] {
  return data.seedTips ?? [];
}
