---
title: Dark mode without the flash
description: A small, dependency-free approach to theme switching that respects system preferences and never flashes the wrong colours.
pubDate: 2024-06-03
tags: [css, frontend]
cover: ../../assets/blog/theme-cover.svg
coverDark: ../../assets/blog/theme-cover-dark.svg
coverAlt: A sun on a light half and a moon on a dark half
---

Most dark-mode bugs come from one thing: applying the theme **after** the page has painted.

## Set the theme before first paint

Put a tiny inline script in `<head>` so it runs before the body renders:

```html title="index.html"
<script>
  const stored = localStorage.getItem('theme');
  const dark = matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = stored ?? (dark ? 'dark' : 'light');
</script>
```

> [!TIP]
> Keep this script tiny and inline. An external file would load after first paint and bring the flash back.

> [!WARNING] Private browsing
> `localStorage` can throw in some privacy modes, so wrap reads and writes in `try`/`catch`.

## Drive everything with custom properties

```css title="global.css"
:root {
  --bg: #fbfbfa;
  --text: #1b1b1f;
}

:root[data-theme='dark'] {
  --bg: #0f1013;
  --text: #e8e8ec;
}
```

## Swap images too

A `<picture>` element with a `prefers-color-scheme` media query only follows the OS setting. To follow a
manual toggle, render both images and hide one with CSS. That's what the `ThemeImage` component does.

> [!NOTE]
> `<picture>` is still the right choice for e-mail and RSS readers, where your CSS doesn't run.

## Remember the choice, but not forever

If the visitor picks the same theme as their OS, forget the override so future OS changes still apply.
