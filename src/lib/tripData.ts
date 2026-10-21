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
  /** 이 요일에만 여는 곳 (예: 토요일에만 → [6]). 나머지 요일은 쉬는 날로 보고 출발일 경고에 함께 쓴다 */
  openDays?: number[];
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
  /** 여행지 순서 (loadTrips 정렬, 버전 묶음 대표 고르기, 게임 등). 홈 열쇠 카드는 즐겨찾기 → 열쇠 이미지 → 이름순이고 이 순서는 마지막 기준으로만 쓴다 */
  no?: number;
  /** Short Korean place name shown on the homepage key card */
  shortNameKo?: string;
  /** Optional short tagline shown on the homepage key card */
  tagline?: string;
  /**
   * 같은 여행지를 여러 버전(커플·가족 등)으로 나눌 때 묶는 이름. 홈·갤러리에는 묶음에서 no가 가장 작은
   * 여행지 카드 하나만 보이고, 여행지 페이지 제목 아래에 버전을 오가는 탭이 생긴다.
   */
  variantGroup?: string;
  /** 버전 탭에 쓰는 짧은 이름 (예: 커플, 가족). shortNameKo에서 이 말을 빼면 홈 카드 이름이 된다 */
  variantLabel?: string;
}

/** trips/data/*.json 의 여행지 전체 (비밀코드 여행지 포함, no 순) */
export function loadTrips(): TripData[] {
  const modules = import.meta.glob<{ default: TripData }>('/trips/data/*.json', { eager: true });
  const trips = Object.values(modules)
    .map((m) => m.default)
    .sort((a, b) => (a.no ?? 0) - (b.no ?? 0));
  /* 버전 묶음에 버전 이름이 빠진 여행지가 섞이면 홈에 카드가 둘로 갈라지므로 빌드에서 막는다 */
  const unlabeled = trips.filter((t) => t.variantGroup && !t.variantLabel);
  if (unlabeled.length) {
    throw new Error(`variantGroup이 있는데 variantLabel이 없는 여행지: ${unlabeled.map((t) => t.id).join(', ')}`);
  }
  return trips;
}

/** 목록·검색에 공개하는 여행지 (비밀코드 여행지 제외) */
export function publicTrips(): TripData[] {
  return loadTrips().filter((t) => !t.secretHash);
}

/**
 * 같은 variantGroup으로 묶인 공개 여행지들 (no 순, 자신 포함). 버전 이름(variantLabel)이 있는 것만 치고
 * 둘 이상일 때만 묶음으로 본다. 묶음이 아니거나 비밀코드 여행지면 빈 배열
 */
export function variantsOf(t: TripData, all: TripData[]): TripData[] {
  if (!t.variantGroup || !t.variantLabel || t.secretHash) return [];
  const vs = all.filter((o) => o.variantGroup === t.variantGroup && o.variantLabel && !o.secretHash);
  return vs.length > 1 ? vs : [];
}

/**
 * 홈·갤러리 열쇠 카드로 싣는 여행지: 공개 여행지 중 버전 묶음은 대표(no가 가장 작은 것) 하나만.
 * variants는 그 여행지의 variantsOf 결과라 호출하는 쪽이 다시 구하지 않아도 된다
 */
export function listedTrips(): { trip: TripData; variants: TripData[] }[] {
  const all = publicTrips();
  return all
    .map((trip) => ({ trip, variants: variantsOf(trip, all) }))
    .filter(({ trip, variants }) => !variants.length || variants[0].id === trip.id);
}

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
/** 영문 표시 이름: id 첫 글자만 대문자 */
export function nameEnOf(t: TripData): string {
  return t.id.charAt(0).toUpperCase() + t.id.slice(1);
}

/** 카드에 쓰는 한국어 이름. 버전 묶음이면 shortNameKo에서 버전 이름(커플·가족 등) 낱말을 뺀다 */
export function groupNameKoOf(t: TripData, variants: TripData[]): string {
  const name = t.shortNameKo || t.title;
  const label = t.variantLabel;
  if (!variants.length || !label) return name;
  /* 낱말 단위로 뺀다 ('가족'이 '가족여행' 같은 다른 낱말 속에 있으면 남긴다) */
  return name.split(/\s+/).filter((w) => w !== label).join(' ') || name;
}

/**
 * variants: variantsOf 결과. 묶음이면 카드 이름은 묶음 이름, 테마는 버전 이름들(커플·가족)이 되고
 * aliases에 다른 버전의 주소를 담는다 (그 주소로 저장된 홈 예약 표시를 이 카드로 옮길 때 쓴다)
 */
export function homeCardOf(t: TripData, fallbackNo: number, variants: TripData[] = []) {
  const grouped = variants.length > 0;
  return {
    no: t.no ?? fallbackNo,
    nameEn: nameEnOf(grouped ? { ...t, id: t.variantGroup! } : t),
    url: `/trips/${tripSlug(t)}`,
    nameKo: groupNameKoOf(t, variants),
    tagline: t.tagline || '',
    region: regionOf(t.tags[0] || ''),
    nights: t.tags[t.tags.length - 1] || '',
    theme: grouped
      ? variants.map((v) => v.variantLabel).filter(Boolean).join('·')
      : String(t.tags[1] || '').replace(/^\P{L}+/u, ''),
    loc: t.locationLabel || '',
    aliases: variants.filter((v) => v.id !== t.id).map((v) => `/trips/${tripSlug(v)}`),
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
  openDays?: number[];
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
          ...(p.openDays && p.openDays.length ? { openDays: p.openDays } : {}),
          ...(p.closedNote ? { closedNote: p.closedNote } : {}),
        })),
    });
  }
  return schedule;
}

export function toMobileTips(data: TripData): TripTip[] {
  return data.seedTips ?? [];
}

/** 서버에서 만드는 HTML 문자열에 넣는 값의 이스케이프 */
export function escHtml(v: unknown): string {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
