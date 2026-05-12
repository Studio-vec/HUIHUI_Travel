import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
  output: 'static',
  site: 'https://studio-vec.github.io',
  base: '/HUIHUI_Travel',
});
