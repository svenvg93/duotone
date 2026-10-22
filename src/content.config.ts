import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      // Projects this post is about, by file name: `projects: [shipit]`. Shown on both pages.
      projects: z.array(reference('projects')).default([]),
      // Optional cover image, plus an optional variant shown in dark mode.
      cover: image().optional(),
      coverDark: image().optional(),
      coverAlt: z.string().default(''),
      draft: z.boolean().default(false),
    }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      // Free-form, e.g. "2023 – present" or "Q2 2024". Falls back to the year of `date`.
      period: z.string().optional(),
      role: z.string().optional(),
      status: z.enum(['active', 'maintained', 'archived', 'concept']).optional(),
      stack: z.array(z.string()).default([]),
      cover: image().optional(),
      coverDark: image().optional(),
      coverAlt: z.string().default(''),
      links: z
        .object({
          repo: z.url().optional(),
          demo: z.url().optional(),
          docs: z.url().optional(),
        })
        .default({}),
      featured: z.boolean().default(false),
      // Lower numbers are listed first; ties are sorted by date (newest first).
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog, projects };
