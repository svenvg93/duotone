---
title: Projects, resume and pages
description: Add projects to your portfolio, fill in your resume, create pages like About, and how search and link previews work.
pubDate: 2026-10-17
tags: [duotone, projects]
projects: [shipit]
---

Besides the blog, Duotone has a portfolio of projects, a resume and room for pages like About. This post
covers all three, plus search and link previews. It's linked to the sample Shipit project, so it ends with a
box pointing to that project, and the [Shipit page](../../projects/shipit/) lists this post.

## Projects

Each project is a Markdown file in `src/content/projects/`, published at `/projects/<file name>/`:

```yaml title="src/content/projects/shipit.md"
---
title: Shipit
description: A CLI that gives every pull request its own preview environment.
date: 2024-05-01 # used for sorting
period: 2023 – present # optional; shown instead of the year
role: Lead engineer # optional
status: active # optional: active, maintained, archived or concept
stack: [Go, Kubernetes, TypeScript] # technologies, shown as tags
featured: true # show on the home page
order: 1 # lower numbers first, then newest first
links:
  repo: https://github.com/you/shipit # "Source" button
  demo: https://shipit.example.com # "Live site" button
  docs: https://shipit.example.com/docs # "Docs" button
cover: ../../assets/projects/cli.png
coverDark: ../../assets/projects/cli-dark.png
coverAlt: Terminal showing a deployment
---

What the project is, why you built it and what you learned.
```

Only `title`, `description` and `date` are required. The body is a normal post: headings, images, code,
callouts and everything else from [Text and typography](../text-and-typography/) work here too.

**On the projects page,** technologies used by more than one project become filter buttons, so visitors can
show only your Go or TypeScript work. **On a project page,** the role, timeline, status and stack appear in a
details box next to the text, with buttons for the links.

**On the home page,** the projects section shows projects with `featured: true`, or all projects if none are
featured, in `order`.

> [!TIP]
> Covers are cropped to fit the card. Keep the important part of a screenshot near the middle.

## Resume

The resume page is built from `src/data/resume.json`, which follows the
[JSON Resume](https://jsonresume.org/schema) format. If you already have a JSON Resume file, you can drop it
in. The page shows these parts:

| Section      | JSON key       | Shown as                                    |
| ------------ | -------------- | ------------------------------------------- |
| Header       | `basics`       | Name, title, location, email and profiles   |
| Summary      | `basics.summary` | A paragraph below the header              |
| Experience   | `work`         | A timeline with dates, highlights and links |
| Education    | `education`    | A timeline                                  |
| Skills       | `skills`       | Groups of tags in the sidebar               |
| Languages    | `languages`    | Language and fluency                        |
| Certificates | `certificates` | Name, issuer and date                       |

Dates are written as `2022-03` (year and month) or `2022`. Leave out `endDate` for your current job and it
shows "Present". The **Save as PDF** button opens the print dialog, which always prints a clean, light
version without the site's header and footer.

## Pages like About

Standalone pages are MDX files in `src/pages/`. The file name is the address: `about.mdx` becomes `/about/`
and `uses.mdx` becomes `/uses/`.

```mdx title="src/pages/uses.mdx"
---
layout: '@/layouts/PageLayout.astro'
title: Uses
description: The hardware and software I use every day.
portrait: true # show your avatar next to the title
---

## Hardware

- A laptop that's older than I'd like to admit
```

Add the page to `NAV` in `src/config.ts` to show it in the menu. Callouts, code and components work on
pages too. To link to another page from inside a page, import the link helper; on pages, the name `url` is
already taken by Astro, so give it another name:

```mdx
import { url as withBase } from '@/lib/url';

See my <a href={withBase('/projects/')}>projects</a>.
```

## Search

The search button in the header (or <kbd>⌘K</kbd>, <kbd>Ctrl K</kbd> or <kbd>/</kbd>) searches every post,
project and page. Results link straight to the best-matching section.

The search index is built by `npm run build`, so search works on the published site and with
`npm run preview`. In `npm run dev`, the search box explains that it needs a build.

## Link previews

When someone shares a link to your site, the preview shows an image:

- **Posts and projects with a PNG, JPG or WebP cover** use that cover.
- **Everything else** gets a generated card with your site name, the title, the description and details
  like the date, in your accent colour.

The cards are created during the build. For them to show up on social networks, `site` in
`astro.config.mjs` must be your real address; see [Getting started](../getting-started/#publish).
