// Site-wide settings. Edit this file to make the theme yours.

export const SITE = {
  title: 'Alex Doe',
  description: 'Software engineer writing about web platforms, infrastructure and developer tooling.',
  author: 'Alex Doe',
  role: 'Software Engineer',
  location: 'Amsterdam, NL',
  email: 'hello@example.com',
  // Number of featured projects / recent posts shown on the home page.
  homeProjects: 4,
  homePosts: 5,
};

export const NAV = [
  { label: 'Blog', href: '/blog/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Resume', href: '/resume/' },
];

// `icon` must match a key in src/components/Icon.astro
export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { label: 'Mastodon', href: 'https://mastodon.social/', icon: 'mastodon' },
  { label: 'RSS', href: '/rss.xml', icon: 'rss' },
] as const;
