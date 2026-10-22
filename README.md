# Duotone

A minimal blog + portfolio theme for [Astro](https://astro.build) with light/dark mode, theme-aware images,
project pages and a printable resume. Zero client-side framework: only a few lines of vanilla JS for the
theme toggle, mobile menu and project filter.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Make it yours

| What                       | Where                                     |
| -------------------------- | ----------------------------------------- |
| Name, bio, nav, socials    | `src/config.ts`                           |
| Production URL             | `site` in `astro.config.mjs`              |
| Colours, fonts, spacing    | tokens at the top of `src/styles/global.css` |
| Home page intro            | `src/pages/index.astro`                   |
| Avatar (light + dark)      | `src/assets/profile/avatar*.svg`          |
| Resume                     | `src/data/resume.json`                    |
| Blog posts                 | `src/content/blog/*.md(x)`                |
| Projects                   | `src/content/projects/*.md(x)`            |

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
