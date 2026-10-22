---
title: Pulse Analytics
description: Rebuilt the analytics dashboard for a SaaS product, cutting load times by two thirds.
date: 2021-06-01
period: 2020 – 2022
role: Frontend lead
status: maintained
featured: true
order: 2
stack: [TypeScript, React, PostgreSQL, Web performance]
cover: ../../assets/projects/dashboard.svg
coverDark: ../../assets/projects/dashboard-dark.svg
coverAlt: Analytics dashboard with stat cards and line charts
links:
  demo: https://example.com
---

## Overview

The original dashboard loaded 2.4 MB of JavaScript before showing a single number. Customers on slower
connections waited more than four seconds to see anything.

## Approach

- Moved data aggregation to the server and streamed results.
- Replaced a heavyweight charting library with small SVG components.
- Added performance budgets to CI so regressions fail the build.

| Metric               | Before | After |
| -------------------- | ------ | ----- |
| JS shipped           | 2.4 MB | 310 KB |
| Largest Contentful Paint | 4.1 s  | 1.3 s |
| Lighthouse score     | 48     | 96    |
