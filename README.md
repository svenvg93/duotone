# Duotone

A minimal blog + portfolio theme for [Astro](https://astro.build) with light/dark mode, theme-aware images,
project pages, a printable resume and code tabs. Zero client-side framework: only a few lines of vanilla JS
for the theme toggle, mobile menu, project filter, code tabs and copy buttons.

**Demo:** https://svenvg93.github.io/duotone/

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run check    # type-check
```

## Make it yours

| What                       | Where                                     |
| -------------------------- | ----------------------------------------- |
| Name, bio, nav, socials    | `src/config.ts`                           |
| Production URL / sub-path  | `site` and `base` in `astro.config.mjs`   |
| Colours, fonts, spacing    | tokens at the top of `src/styles/global.css` |
| Home page text & sections  | `HOME` in `src/config.ts`                 |
| Avatar (light + dark)      | `HOME.avatar` (images in `src/assets/profile/`) |
| Resume                     | `src/data/resume.json`                    |
| Blog posts                 | `src/content/blog/*.md(x)`                |
| Projects                   | `src/content/projects/*.md(x)`            |

## Home page

Everything on the home page is set in `HOME` in `src/config.ts`:

```ts
export const HOME: HomeConfig = {
  eyebrow: `${SITE.role} · ${SITE.location}`, // '' hides it
  headline: "Hi, I'm Alex. I build reliable software for the web.",
  intro: 'I work on developer platforms…',
  actions: [
    { label: 'See my work', href: '/projects/', primary: true },
    { label: 'Resume', href: '/resume/' },
  ],
  showSocials: true,
  avatar: { light: avatar, dark: avatarDark, alt: 'Portrait of Alex Doe' }, // remove to hide
  sections: [
    // shown in this order; remove one to hide it
    { type: 'posts', title: 'Recent writing', count: 5, linkLabel: 'All posts' },
    { type: 'projects', title: 'Selected projects', count: 4, linkLabel: 'All projects' },
  ],
};
```

The projects section shows projects with `featured: true`, or all projects if none are featured.

## Dark / light mode

The theme is stored on `<html data-theme="light|dark">`. An inline script in `BaseHead.astro` sets it
before first paint (stored choice → OS preference), so there's no flash. The toggle remembers an explicit
choice; picking the same theme as your OS clears the override so the site follows the OS again.

Code blocks use Shiki dual themes (`astro.config.mjs`) and switch with the site.

## Images per theme

**Front matter**: posts and projects accept `cover` and an optional `coverDark`:

```yaml
cover: ../../assets/projects/app.png
coverDark: ../../assets/projects/app-dark.png
coverAlt: Screenshot of the app
```

**In MDX** use the `ThemeImage` component:

```mdx
import ThemeImage from '@/components/ThemeImage.astro';
import diagram from '@/assets/blog/diagram.png';
import diagramDark from '@/assets/blog/diagram-dark.png';

<ThemeImage light={diagram} dark={diagramDark} alt="Architecture" caption="Optional caption" />
```

**Anywhere else**: add `class="only-light"` or `class="only-dark"` to any element.

Unlike `<picture>` + `prefers-color-scheme`, this follows the manual toggle too. Print always uses the light variant.

## Code blocks

Code is highlighted with Shiki in both themes. Add `title="…"` to show a file name above a block:

````md
```ts title="src/config.ts"
export const SITE = { title: 'Alex Doe' };
```
````

Every block gets a **Copy** button (shown on hover, always visible on touch screens).

## Search

Full-text search over posts and projects, powered by [Pagefind](https://pagefind.app). Open it with the
header button, <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> or <kbd>/</kbd>; use the arrow keys and <kbd>Enter</kbd> to pick a
result. Results link to the best-matching section of a page.

`npm run build` runs `pagefind --site dist` after `astro build` to write the index to `dist/pagefind/`. It
only exists in a build, so in `astro dev` the dialog asks you to use `npm run build && npm run preview`.

What gets indexed is controlled with attributes: `data-pagefind-body` marks content to index (post and
project layouts), `data-pagefind-ignore` leaves parts out (table of contents, prev/next links, project
details), and `data-pagefind-meta` sets the title and type shown in results.

## Heading links

Headings `h2`–`h4` in posts and projects get a link icon (on hover or keyboard focus, always faintly
visible on touch screens) so readers can copy a link to that section. It's added by
`src/lib/heading-links.mjs`, which also assigns the heading ids using the same slugger as Astro, so ids,
links, the table of contents and search results all agree.

## Callouts

Use GitHub's alert syntax in `.md` and `.mdx`, so the same Markdown also renders on GitHub:

```md
> [!NOTE]
> Useful information that users should know.

> [!WARNING] Custom title
> Text after the marker becomes the title.
```

Types: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`. Colours are the `--callout-*` tokens in
`global.css`; the plugin is `src/lib/callouts.mjs`. A blockquote without a marker stays a normal quote.

## Code tabs

In MDX, wrap fenced code blocks in `<CodeTabs>`. Each block's `title="…"` becomes its tab label (falling
back to the language). Leave a blank line around each block:

````mdx
import CodeTabs from '@/components/CodeTabs.astro';

<CodeTabs group="pkg">

```sh title="npm"
npm install shipit-cli
```

```sh title="pnpm"
pnpm add shipit-cli
```

</CodeTabs>
````

Tabs with the same `group` switch together across the page, and the visitor's choice is remembered on later
visits. Leave `group` off for independent tabs (e.g. `config.yaml` / `config.json`). Tabs support arrow
keys, Home and End, and without JavaScript the first block is shown.

## Blog posts

```yaml
---
title: My post
description: One-line summary used in lists, RSS and meta tags.
pubDate: 2024-09-12
updatedDate: 2024-10-01   # optional
tags: [css, frontend]
cover: ../../assets/blog/cover.png   # optional (+ coverDark, coverAlt)
draft: true                          # visible in dev only
---
```

Posts get reading time, a table of contents (when there are 3+ headings, on wide screens), tag pages,
previous/next links and an RSS feed at `/rss.xml`.

## Projects

```yaml
---
title: Shipit
description: Short pitch shown on cards.
date: 2024-05-01            # used for sorting
period: 2023 – present      # optional display text
role: Lead engineer
status: active              # active | maintained | archived | concept
stack: [Go, Kubernetes]     # shared technologies become filter buttons on /projects
featured: true              # shown on the home page
order: 1                    # lower first, then newest
links: { repo: https://…, demo: https://…, docs: https://… }
cover: ../../assets/projects/shipit.png
coverDark: ../../assets/projects/shipit-dark.png
---
```

## Resume

`src/data/resume.json` follows the [JSON Resume](https://jsonresume.org/schema) schema (basics, work,
education, skills, languages, certificates), so you can reuse it with other JSON Resume tools. The
**Save as PDF** button uses the browser's print dialog; a print stylesheet hides the chrome and forces
light colours.

> Social preview images (`og:image`) are only generated from raster covers (PNG/JPG/WebP), since social
> networks don't render SVG.

## Deploying

Any static host works: run `npm run build` and upload `dist/`. Set `site` in `astro.config.mjs` to your
URL, and `base` if the site lives under a sub-path. Internal links go through `url()` in
`src/lib/url.ts`, so they follow `base` automatically.

**GitHub Pages:** `.github/workflows/deploy.yml` type-checks and builds every pull request, and deploys
`main` to Pages. Enable it under *Settings → Pages → Source: GitHub Actions*. The workflow passes the Pages
URL and sub-path to the build through `SITE_URL` and `BASE_PATH`, so no config changes are needed.

## License

[MIT](LICENSE)
