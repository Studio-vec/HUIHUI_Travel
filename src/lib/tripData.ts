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
  scheduleVersion?: string;
  infoBanner?: TripInfoBanner;
  operatorNote: { avatar: string; name: string; text: string };
  seedTips: TripTip[];
  places: TripPlace[];
  /** Homepage key-card display order (defaults to array order if omitted) */
  no?: number;
  /** Short Korean place name shown on the homepage key card */
  shortNameKo?: string;
  /** Optional short tagline shown on the homepage key card */
  tagline?: string;
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
        })),
    });
  }
  return schedule;
}

export function toMobileTips(data: TripData): TripTip[] {
  return data.seedTips ?? [];
}
