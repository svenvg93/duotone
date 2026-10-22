import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@/config';
import { getPosts } from '@/lib/content';
import { url } from '@/lib/url';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(import.meta.env.BASE_URL, context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: url(`/blog/${post.id}/`),
    })),
  });
}
