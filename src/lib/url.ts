const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Prefix an internal, root-relative path with the configured `base`, so the
 * site also works when deployed under a sub-path (e.g. GitHub Pages project
 * sites at user.github.io/repo/). External URLs, mailto: and #anchors pass through.
 */
export function url(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return base + path;
}
