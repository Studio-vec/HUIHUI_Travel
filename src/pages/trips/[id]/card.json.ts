import type { APIRoute } from 'astro';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homeCardOf, tripSlug } from '../../../lib/tripData';
import type { TripData } from '../../../lib/tripData';

/* 비밀 여행지의 홈 카드 정보. 코드를 한 번 연 브라우저의 홈이 매번 이 파일을 다시 읽어
   최신 정보로 카드를 그리고, 404면(코드 변경·삭제·공개 전환) 저장된 목록에서 지운다.
   주소가 해시라서 코드를 아는 사람만 찾을 수 있다. */
export function getStaticPaths() {
  const modules = import.meta.glob('/trips/data/*.json', { eager: true }) as Record<
    string,
    { default: TripData }
  >;
  return Object.values(modules)
    .map((m) => m.default)
    .filter((t) => t.secretHash)
    .map((trip) => ({ params: { id: tripSlug(trip) }, props: { trip } }));
}

export const GET: APIRoute = ({ props }) => {
  const trip = props.trip as TripData;
  /* 전용 열쇠 이미지가 없으면 홈이 '준비 중'으로 바꾸므로 비밀코드 열쇠 이미지를 쓴다 */
  const key = existsSync(join(process.cwd(), 'public', 'assets', 'keys', `${trip.id}.webp`))
    ? `/assets/keys/${trip.id}.webp`
    : '/assets/keys/secret.webp';
  return new Response(JSON.stringify({ ...homeCardOf(trip, 999), key }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
