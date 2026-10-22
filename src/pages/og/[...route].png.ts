// Social preview images, built as static PNGs:
//   /og/index.png              site-wide card (home, lists, anything without its own)
//   /og/blog/<post>.png        one per post
//   /og/projects/<project>.png one per project
//   /og/pages/<page>.png       one per MDX page in src/pages (about, uses, …)
// BaseHead picks the right one; see ogImage in BaseLayout/BaseHead.
import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '@/config';
import { getPosts, getProjects, readingTime } from '@/lib/content';
import { renderCard, type Card } from '@/lib/og';

const date = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// MDX pages using PageLayout; their route is the file path below src/pages.
const pages = import.meta.glob<{ frontmatter: { title: string; description?: string } }>('/src/pages/**/*.mdx', {
  eager: true,
});

export const getStaticPaths = (async () => {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const card = (route: string, props: Card) => ({ params: { route }, props });

  return [
    card('index', { title: SITE.title, description: SITE.description, meta: `${SITE.role} · ${SITE.location}` }),
    ...posts.map((p) =>
      card(`blog/${p.id}`, {
        kind: 'Blog post',
        title: p.data.title,
        description: p.data.description,
        meta: `${date(p.data.pubDate)} · ${readingTime(p.body)}${p.data.tags.length ? ' · ' + p.data.tags.map((t) => `#${t}`).join(' ') : ''}`,
      }),
    ),
    ...projects.map((p) =>
      card(`projects/${p.id}`, {
        kind: 'Project',
        title: p.data.title,
        description: p.data.description,
        meta: [p.data.period ?? String(p.data.date.getFullYear()), ...p.data.stack.slice(0, 4)].join(' · '),
      }),
    ),
    ...Object.entries(pages).map(([file, mod]) =>
      card(`pages/${file.replace(/^\/src\/pages\//, '').replace(/\.mdx$/, '')}`, {
        title: mod.frontmatter.title,
        description: mod.frontmatter.description,
      }),
    ),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props as Card)), { headers: { 'Content-Type': 'image/png' } });
