import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://wissen-handeln.com',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
