// Accent colour: turns THEME.accent from src/config.ts into the CSS custom
// properties the theme uses, for light and dark mode. Shades are derived at
// build time so any accent stays readable (WCAG AA contrast for text).
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

// Page backgrounds from global.css (--bg); the accent shades are checked against these.
const BG = { light: '#fbfbfa', dark: '#0f1013' };
const WHITE = '#ffffff';
const BLACK = '#000000';

type RGB = [number, number, number];

function parse(hex: string): RGB {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`THEME.accent: "${hex}" is not a hex colour like #2f5bea`);
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

export function accentTokens(setting: AccentSetting = THEME.accent) {
  const { light, dark } = typeof setting === 'string' ? ACCENT_PRESETS[setting] : setting;
  const onAccent = (c: string) => (contrast(c, WHITE) >= contrast(c, BLACK) ? WHITE : BG.dark);
  return {
    light: {
      '--accent': light,
      '--accent-text': readable(light, BG.light, BLACK),
      '--accent-soft': mix(BG.light, light, 0.1),
      '--on-accent': onAccent(light),
    },
    dark: {
      '--accent': dark,
      '--accent-text': readable(dark, BG.dark, WHITE),
      '--accent-soft': mix(BG.dark, dark, 0.14),
      '--on-accent': onAccent(dark),
    },
  };
}

/** CSS for <head>: light tokens, dark tokens, and light tokens again for print. */
export function accentCss() {
  const { light, dark } = accentTokens();
  const decl = (t: Record<string, string>) => Object.entries(t).map(([k, v]) => `${k}:${v}`).join(';');
  return [
    `:root{${decl(light)}}`,
    `:root[data-theme='dark']{${decl(dark)}}`,
    `@media print{:root[data-theme='dark']{${decl(light)}}}`,
  ].join('\n');
}
