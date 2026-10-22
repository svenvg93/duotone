---
title: Dark mode without the flash
description: A small, dependency-free approach to theme switching that respects system preferences and never flashes the wrong colours.
pubDate: 2024-06-03
tags: [css, frontend]
---

Most dark-mode bugs come from one thing: applying the theme **after** the page has painted.

## Set the theme before first paint

Put a tiny inline script in `<head>` so it runs before the body renders:

```html
<script>
  const stored = localStorage.getItem('theme');
  const dark = matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = stored ?? (dark ? 'dark' : 'light');
</script>
```

## Drive everything with custom properties

```css
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

## Remember the choice, but not forever

If the visitor picks the same theme as their OS, forget the override so future OS changes still apply.
