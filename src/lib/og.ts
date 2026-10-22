// Social preview cards (og:image): a 1200×630 PNG with the page title, drawn
// with Satori (layout + text → SVG paths) and rasterised with Sharp. The font is
// bundled (@fontsource/inter), so cards look the same on every machine and in CI.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { SITE } from '@/config';
import { themeTokens } from '@/lib/theme';

// A type alias (not an interface) so it can be used as Astro page props.
export type Card = {
  /** Small label above the title, e.g. "Blog post". */
  kind?: string;
  title: string;
  description?: string;
  /** Bottom line, e.g. "Sep 12, 2024 · 4 min read". */
  meta?: string;
};

export const OG_SIZE = { width: 1200, height: 630 };

const require = createRequire(import.meta.url);
let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 700 }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all(
    ([400, 700] as const).map(async (weight) => ({
      name: 'Inter',
      weight,
      data: await readFile(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`)),
    })),
  ));

// Satori takes React-like element objects; this keeps the markup readable without JSX.
// Elements are flex by default; text that uses lineClamp needs display: 'block'.
type Node = { type: 'div'; props: { style: Record<string, unknown>; children: (Node | string)[] } };
const h = (style: Record<string, unknown>, ...children: (Node | string | false | undefined)[]): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children: children.filter((c): c is Node | string => !!c) },
});

export async function renderCard({ kind, title, description, meta }: Card): Promise<Buffer> {
  // Light-theme colours, including the accent from THEME in config.ts.
  const c = themeTokens().light;
  const titleSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;

  const card = h(
    {
      ...OG_SIZE,
      boxSizing: 'border-box', // keep padding and the accent border inside 1200×630
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px 72px',
      background: c['--bg'],
      color: c['--text'],
      fontFamily: 'Inter',
      borderBottom: `14px solid ${c['--accent']}`,
    },
    // Site name with the favicon mark
    h(
      { alignItems: 'center', gap: 18, fontSize: 30, fontWeight: 700 },
      h(
        { width: 48, height: 48, borderRadius: 12, background: c['--accent'], color: c['--on-accent'], alignItems: 'center', justifyContent: 'center', fontSize: 24 },
        '</>',
      ),
      SITE.title,
    ),
    h(
      { flexDirection: 'column', gap: 22 },
      kind && h({ fontSize: 26, fontWeight: 700, color: c['--accent-text'], textTransform: 'uppercase', letterSpacing: 2 }, kind),
      h({ display: 'block', fontSize: titleSize, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5, lineClamp: 3 }, title),
      description && h({ display: 'block', fontSize: 30, lineHeight: 1.4, color: c['--text-muted'], lineClamp: 2 }, description),
    ),
    h({ fontSize: 24, color: c['--text-muted'] }, meta ?? SITE.description),
  );

  const svg = await satori(card as Parameters<typeof satori>[0], { ...OG_SIZE, fonts: await loadFonts() });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
