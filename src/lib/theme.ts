// Colours: the light and dark palettes, plus the accent from THEME in
// src/config.ts, turned into the CSS custom properties the theme uses (injected
// by ThemeHead.astro). Accent shades are derived at build time so any accent
// stays readable (WCAG AA contrast for text) on the palette's background.
import { THEME } from '@/config';

export const ACCENT_PRESETS = {
  blue: { light: '#2f5bea', dark: '#7c9bff' },
  indigo: { light: '#4f46e5', dark: '#a5b4fc' },
  violet: { light: '#7c3aed', dark: '#b197fc' },
  teal: { light: '#0f766e', dark: '#2dd4bf' },
  green: { light: '#15803d', dark: '#4ade80' },
  orange: { light: '#c2410c', dark: '#fb923c' },
  rose: { light: '#e11d48', dark: '#fb7185' },
} as const;

export type AccentPreset = keyof typeof ACCENT_PRESETS;
export type AccentSetting = AccentPreset | { light: string; dark: string };

/** Every colour token except the accent ones, for one mode. */
export interface Palette {
  '--bg': string;
  '--bg-elev': string;
  '--bg-muted': string;
  '--text': string;
  '--text-muted': string;
  '--border': string;
  '--code-bg': string;
  '--shadow': string;
  '--callout-tip': string;
  '--callout-important': string;
  '--callout-warning': string;
  '--callout-caution': string;
  /** Project status "Active". */
  '--status-active': string;
}

export interface ThemeConfig {
  accent: AccentSetting;
  mode: 'system' | 'light' | 'dark';
  /** Overrides for single tokens of the default palette. */
  palette?: { light?: Partial<Palette>; dark?: Partial<Palette> };
}

export const PALETTE: { light: Palette; dark: Palette } = {
  light: {
    '--bg': '#fbfbfa',
    '--bg-elev': '#ffffff',
    '--bg-muted': '#f2f2ef',
    '--text': '#1b1b1f',
    '--text-muted': '#5d5e66',
    '--border': '#e3e3df',
    '--code-bg': '#f4f4f1',
    '--shadow': '0 1px 2px rgb(0 0 0 / 0.04), 0 6px 24px -8px rgb(0 0 0 / 0.08)',
    '--callout-tip': '#1a7f37',
    '--callout-important': '#7c3aed',
    '--callout-warning': '#a15c07',
    '--callout-caution': '#c42b2b',
    '--status-active': '#16a34a',
  },
  dark: {
    '--bg': '#0f1013',
    '--bg-elev': '#17181c',
    '--bg-muted': '#1d1f24',
    '--text': '#e8e8ec',
    '--text-muted': '#9a9ba5',
    '--border': '#2a2c33',
    '--code-bg': '#16171b',
    '--shadow': '0 1px 2px rgb(0 0 0 / 0.3), 0 8px 28px -10px rgb(0 0 0 / 0.6)',
    '--callout-tip': '#4ade80',
    '--callout-important': '#b197fc',
    '--callout-warning': '#fbbf24',
    '--callout-caution': '#f87171',
    '--status-active': '#4ade80',
  },
};

// Printing (the resume's "Save as PDF") always uses the light palette with these changes.
const PRINT: Partial<Palette> = {
  '--bg': '#ffffff',
  '--bg-elev': '#ffffff',
  '--text': '#111111',
  '--text-muted': '#555555',
  '--border': '#dddddd',
  '--shadow': 'none',
};

const WHITE = '#ffffff';
const BLACK = '#000000';

type RGB = [number, number, number];

function parse(hex: string): RGB {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`THEME: "${hex}" is not a hex colour like #2f5bea`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as RGB;
}

const toHex = (rgb: RGB) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Mix `a` with `b`; `amount` is the share of `b` (0–1). */
const mix = (a: string, b: string, amount: number) => {
  const [x, y] = [parse(a), parse(b)];
  return toHex(x.map((v, i) => v + (y[i] - v) * amount) as RGB);
};

function luminance(hex: string) {
  const [r, g, b] = parse(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Darken (light mode) or lighten (dark mode) until text reaches 4.5:1 on the background. */
function readable(color: string, bg: string, towards: string) {
  for (let t = 0; t <= 1; t += 0.05) {
    const c = mix(color, towards, t);
    if (contrast(c, bg) >= 4.5) return c;
  }
  return towards;
}

/** All colour tokens for light and dark mode: the palette (with THEME.palette overrides) plus the accent. */
export function themeTokens(theme: ThemeConfig = THEME) {
  const accent = typeof theme.accent === 'string' ? ACCENT_PRESETS[theme.accent] : theme.accent;
  const light = { ...PALETTE.light, ...theme.palette?.light };
  const dark = { ...PALETTE.dark, ...theme.palette?.dark };
  const onAccent = (c: string) => (contrast(c, WHITE) >= contrast(c, BLACK) ? WHITE : dark['--bg']);
  return {
    light: {
      ...light,
      '--accent': accent.light,
      '--accent-text': readable(accent.light, light['--bg'], BLACK),
      '--accent-soft': mix(light['--bg'], accent.light, 0.1),
      '--on-accent': onAccent(accent.light),
      '--callout-note': 'var(--accent)',
    },
    dark: {
      ...dark,
      '--accent': accent.dark,
      '--accent-text': readable(accent.dark, dark['--bg'], WHITE),
      '--accent-soft': mix(dark['--bg'], accent.dark, 0.14),
      '--on-accent': onAccent(accent.dark),
      '--callout-note': 'var(--accent)',
    },
  };
}

/** CSS for <head>: light tokens, dark tokens, and light tokens (with PRINT) for print. */
export function themeCss() {
  const { light, dark } = themeTokens();
  const decl = (scheme: string, t: Record<string, string>) =>
    [`color-scheme:${scheme}`, ...Object.entries(t).map(([k, v]) => `${k}:${v}`)].join(';');
  return [
    `:root{${decl('light', light)}}`,
    `:root[data-theme='dark']{${decl('dark', dark)}}`,
    `@media print{:root,:root[data-theme='dark']{${decl('light', { ...light, ...PRINT })}}}`,
  ].join('\n');
}
