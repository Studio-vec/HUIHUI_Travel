import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  // canonical / sitemap.xml / robots.txt 생성 기준 URL.
  // 커스텀 도메인을 연결하면 이 값만 바꾸면 된다.
  site: 'https://huihui-travel.vercel.app',
  integrations: [vue()],
  output: 'static',
});
