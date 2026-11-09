// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static site only: no adapter, no SSR. Cloudflare Pages serves `dist/`.
// English only (locked 2026-11-09): no i18n block, no /hi/ routes.
export default defineConfig({
  site: 'https://kumquote.pages.dev',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
