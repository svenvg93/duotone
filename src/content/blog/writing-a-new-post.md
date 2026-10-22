---
title: Writing a new post
description: Where posts live, every front matter field, covers with a dark variant, images, links and drafts.
pubDate: 2026-10-19
tags: [duotone, writing]
---

Every post is a Markdown file in `src/content/blog/`. The file name becomes the address:
`src/content/blog/my-first-post.md` is published at `/blog/my-first-post/`. Folders work too:
`2026/launch.md` becomes `/blog/2026/launch/`.

This post has no cover image, so it shows as a text-only card in the post list.

## Front matter

Each post starts with front matter between `---` lines:

```yaml title="src/content/blog/my-first-post.md"
---
title: My first post
description: One sentence that appears in post lists, search results, the RSS feed and link previews.
pubDate: 2026-10-19
updatedDate: 2026-10-21 # optional, shown as "updated …"
tags: [astro, css] # optional, each tag gets its own page
projects: [shipit] # optional, links this post to projects
cover: ../../assets/blog/my-cover.png # optional
coverDark: ../../assets/blog/my-cover-dark.png # optional, shown in dark mode
coverAlt: What the cover shows # describe the image for screen readers
draft: true # optional, hides the post from the published site
---

The post starts here.
```

| Field         | Required | What it does                                                          |
| ------------- | :------: | --------------------------------------------------------------------- |
| `title`       |   yes    | Page title, card title and social preview title                       |
| `description` |   yes    | Summary in lists, search results, the feed and link previews          |
| `pubDate`     |   yes    | Publication date; posts are sorted by it, newest first                |
| `updatedDate` |    no    | Shown next to the date when you've revised a post                     |
| `tags`        |    no    | Links to tag pages such as `/tags/astro/`                             |
| `projects`    |    no    | Project file names; links the post and the project both ways          |
| `cover`       |    no    | Image on the card and at the top of the post                          |
| `coverDark`   |    no    | Replaces `cover` in dark mode                                         |
| `coverAlt`    |    no    | Alternative text for the cover                                        |
| `draft`       |    no    | `true` keeps the post out of the build; it still shows in `npm run dev` |

If a field is missing or has the wrong type, `npm run dev` and `npm run build` show an error that names
the file and field.

## Cover images

Put images in `src/assets/` and refer to them with a path relative to the post. Astro resizes them and
converts them to modern formats, so you can use a large original.

The optional `coverDark` is shown instead of `cover` when the site is in dark mode. Use it for screenshots
of an app with its own dark theme, or for diagrams drawn on a white background.

PNG, JPG and WebP covers are also used as the post's preview image when someone shares a link. For posts
without one, the theme generates a preview card with the title and description. SVG covers work on the site,
but social networks can't show them, so those posts get a generated card too.

## Tags

Tags are free text. Each one gets a page listing its posts (`/tags/astro/`), and the blog page shows all
tags with a count. Keep them lowercase and short so they're easy to reuse.

## Linking a post to a project

If a post is about something in your portfolio, list the project's file name (without `.md`):

```yaml
projects: [shipit]
```

The post then ends with a box linking to the project, and the project page lists the post under
"Writing about Shipit". A name that doesn't match a project stops the build with an error, so these links
can't break silently. The post about [projects, the resume and pages](../projects-resume-and-pages/) is
linked to the sample Shipit project, so you can see both sides.

## Images in a post

Use normal Markdown image syntax with a path relative to the post:

```md
![The preview pipeline](../../assets/blog/diagram.svg)
```

Images stored in `src/assets/` are optimised at build time. To show a different image in dark mode, use the
`ThemeImage` component in an `.mdx` post, as shown in [Text and typography](../text-and-typography/#images).

## Showing something in one theme only

To show any part of a post only in light or only in dark mode, wrap it in an element with the class
`only-light` or `only-dark`. Plain HTML works in `.md` posts too:

```html
<p class="only-light">You're reading this in light mode.</p>
<p class="only-dark">You're reading this in dark mode.</p>
```

<p class="only-light"><em>You're reading this in light mode. Switch to dark mode and this sentence changes.</em></p>
<p class="only-dark"><em>You're reading this in dark mode. Switch to light mode and this sentence changes.</em></p>

This follows the theme button as well as the device setting. When printing, the light version is used.

## Links

Link to other posts with a relative path, like `[Getting started](../getting-started/)`. Relative links keep
working if your site is published under a sub-path such as `https://you.github.io/blog/`, where a link like
`/blog/getting-started/` would point to the wrong place.

Headings get their own address, so you can link to a section: `../text-and-typography/#callouts`. Readers
can copy a section's link with the icon that appears when they hover over a heading.

## Markdown or MDX

Use `.md` for most posts. Use `.mdx` when you need components:

- **Code tabs**, for example the same command for npm, pnpm and yarn
- **`ThemeImage`**, for an image with a dark-mode version
- Anything else you import from `src/components/`

MDX treats `{` and `<` as code, so write them as `` `{` `` and `` `<` `` in inline code, or escape them,
when you mean the characters themselves. [Text and typography](../text-and-typography/) is an MDX post that
uses both components.

## What readers see

Besides your text, a post page shows:

- **The date and reading time** at the top, plus "updated …" when you set `updatedDate`. Reading time is
  estimated at 220 words a minute, not counting code blocks.
- **The tags**, each linking to its tag page.
- **"On this page"**, a list of the `##` and `###` headings, when the post has at least three. It appears
  next to the text on wide screens and highlights the section being read.
- **A link icon** on each heading, for sharing a link to that section.
- **The project box** when the post has `projects`.
- **Links to the previous and next post** at the bottom, by date.

## Drafts

Add `draft: true` to work on a post without publishing it. Drafts appear while you run `npm run dev`, marked
with a "draft" label, and are left out of `npm run build`: no page, no card, no feed entry, no search
result.
