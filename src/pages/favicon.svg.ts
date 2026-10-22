// The favicon, drawn in the accent colour from THEME in src/config.ts.
// It follows the browser's light/dark preference (favicons can't see the site toggle).
import { accentTokens } from '@/lib/theme';

export function GET() {
  const { light, dark } = accentTokens();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>rect{fill:${light['--accent']}}path{stroke:${light['--on-accent']}}@media (prefers-color-scheme:dark){rect{fill:${dark['--accent']}}path{stroke:${dark['--on-accent']}}}</style>
  <rect width="32" height="32" rx="8"/>
  <path d="m11 11-5 5 5 5M21 11l5 5-5 5" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
