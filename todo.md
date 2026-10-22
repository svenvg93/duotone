# Duotone TODO

Items marked ⭐ are the suggested next batch.

## For readers

- [x] ⭐ **Search**: [Pagefind](https://pagefind.app/) builds a static index during the build. Add a ⌘K search box in the header.
- [x] ⭐ **Heading links**: show a `#` link on headings to copy a link to that section.
- [ ] ⭐ **Current section in "On this page"**: highlight the section being read while scrolling.
- [x] ⭐ **Callouts**: note, tip and warning boxes in Markdown (GitHub-style `> [!NOTE]`).
- [ ] **Image zoom**: click a screenshot or diagram to view it larger.

## Connecting content

- [ ] **Related posts / series**: a `series` front-matter field, or related posts by shared tags, at the end of a post.
- [ ] **Link posts and projects**: "Posts about this project" on project pages, and a link back from the post.
- [ ] **Project galleries**: several screenshots per project, not just one cover.
- [ ] **Blog pagination**: only needed once there are about 30 posts.

## Sharing and engagement

- [ ] **Social preview images**: generate a card per post (title on a theme background), so posts without a PNG/JPG cover still get one.
- [ ] **Comments**: optional [giscus](https://giscus.app/) (GitHub Discussions) that follows the light/dark theme.
- [ ] **Analytics**: a setting for Plausible, Umami or similar.

## Setting it up

- [ ] ⭐ **Home page text in config**: move the hero headline and intro from `src/pages/index.astro` to `src/config.ts`.
- [ ] **About page**
- [ ] **Language and date format**: make `lang="en"` and the US date format configurable.

## Polish

- [ ] **README screenshot**: needed for the [Astro themes directory](https://astro.build/themes/).
- [ ] **Test the resume's "Save as PDF" output**: only the on-screen version has been checked.
- [ ] **Status colors**: the green "Active" project status is hard-coded instead of being a theme color.
- [ ] **Code tabs flash**: a saved tab choice briefly shows the first tab on page load.
- [ ] **Fonts**: consider one web font for headings (system fonts only now).
