/** 사이트 이름·운영 주체와 구조화 데이터(JSON-LD) 직렬화. 여러 페이지가 함께 쓴다 */

export const SITE_NAME = 'Travel HUIHUI';
export const PUBLISHER_NAME = 'Studio.Vec';

/** 페이지의 정식 주소. canonical·og:url·JSON-LD가 같은 값을 쓴다 */
export const canonicalOf = (pathname: string, site: URL) => new URL(pathname.replace(/\/index\.html$/, ''), site).href;

export function publisherOf(site: URL) {
  return {
    '@type': 'Organization',
    name: PUBLISHER_NAME,
    url: site.href,
    logo: { '@type': 'ImageObject', url: new URL('/icon-192.png', site).href },
    sameAs: ['https://studiovec.framer.website/'],
  };
}

/** <script type="application/ld+json">에 넣을 문자열. 노드들을 한 @graph로 묶고, </script>로 끊기지 않게 <를 이스케이프한다 */
export const jsonLdString = (nodes: object[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
