---
title: Tiny Habits
description: A small offline-first habit tracker I built to learn modern PWA APIs.
date: 2023-02-01
role: Solo side project
status: archived
order: 3
stack: [TypeScript, IndexedDB, PWA]
cover: ../../assets/projects/mobile.svg
coverDark: ../../assets/projects/mobile-dark.svg
coverAlt: Two phone screens showing a habit tracking app
links:
  repo: https://github.com/
---

A weekend project that grew into something I used daily for a year. It works fully offline, syncs when a
connection is available, and fits in under 50 KB.

## What I learned

- Service worker lifecycles are subtle; versioning caches explicitly saved me a lot of pain.
- IndexedDB is pleasant once wrapped in a tiny promise-based helper.
