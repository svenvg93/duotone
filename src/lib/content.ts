import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;

/** Drafts are visible in `astro dev` but excluded from production builds. */
const visible = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', visible);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', visible);
  return projects.sort((a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf());
}

/** Projects a post links to with `projects: [...]` (drafts excluded in production, like everywhere else). */
export function projectsForPost(post: Post, projects: Project[]): Project[] {
  const ids = new Set(post.data.projects.map((ref) => ref.id));
  return projects.filter((p) => ids.has(p.id));
}

/** Posts that link to a project, newest first. */
export function postsForProject(project: Project, posts: Post[]): Post[] {
  return posts.filter((post) => post.data.projects.some((ref) => ref.id === project.id));
}

export function getTags(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const tag of posts.flatMap((p) => p.data.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return new Map([...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-');

/** Rough reading time from the raw Markdown body (~220 wpm). */
export function readingTime(body = ''): string {
  const words = body.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
