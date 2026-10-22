// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Change this to your production URL (used for RSS, sitemap and canonical links).
  site: 'https://example.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Dual themes: colours switch with the site's light/dark mode (see global.css).
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
      transformers: [
        {
          // ```ts title="config.ts" → <pre data-title="config.ts">, used by <CodeTabs> for tab labels.
          name: 'code-title',
          pre(node) {
            const title = this.options.meta?.__raw?.match(/title=["']([^"']+)["']/)?.[1];
            if (title) node.properties['data-title'] = title;
          },
        },
      ],
    },
  },
});
