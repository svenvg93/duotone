// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { codeBlock } from './src/lib/shiki-code-block.mjs';

export default defineConfig({
  // Your production URL (used for RSS, sitemap and canonical links). The GitHub Pages
  // workflow sets SITE_URL and BASE_PATH; otherwise replace the fallback with your domain.
  site: process.env.SITE_URL || 'https://example.com',
  // Sub-path the site is served from, e.g. '/duotone' for user.github.io/duotone/.
  base: process.env.BASE_PATH || '/',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Dual themes: colours switch with the site's light/dark mode (see global.css).
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
      // Wraps code blocks for the title bar (```ts title="file.ts") and copy button.
      transformers: [codeBlock()],
    },
  },
});
