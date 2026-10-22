// Site-wide settings. Edit this file to make the theme yours.
import type { ImageMetadata } from 'astro';
import type { AccentSetting } from '@/lib/theme';
import avatar from '@/assets/profile/avatar.svg';
import avatarDark from '@/assets/profile/avatar-dark.svg';

export const SITE = {
  title: 'Alex Doe',
  description: 'Software engineer writing about web platforms, infrastructure and developer tooling.',
  author: 'Alex Doe',
  role: 'Software Engineer',
  location: 'Amsterdam, NL',
  email: 'hello@example.com',
  // How posts are listed on the blog, tag and home pages: image cards, or a compact
  // date + title list (grouped by year on /blog).
  postList: 'cards' as 'cards' | 'compact',
};

export const THEME: { accent: AccentSetting } = {
  // Links, buttons, tags, highlights and the favicon. A preset — 'blue', 'indigo',
  // 'violet', 'teal', 'green', 'orange', 'rose' — or your own colours:
  //   accent: { light: '#0f766e', dark: '#2dd4bf' },
  // Matching shades (readable link text, soft highlight, button text) are derived automatically.
  accent: 'blue',
};

interface HomeConfig {
  /** Small line above the headline; '' hides it. */
  eyebrow: string;
  headline: string;
  intro: string;
  /** Buttons under the intro. `primary` gets the accent colour. */
  actions: { label: string; href: string; primary?: boolean }[];
  /** Show the SOCIALS icons (except RSS) next to the buttons. */
  showSocials: boolean;
  /** Portrait with an optional dark-mode variant; leave out to hide it. */
  avatar?: { light: ImageMetadata; dark?: ImageMetadata; alt: string };
  /**
   * Sections below the intro, in this order; remove one to hide it.
   * `projects` shows featured projects (`featured: true`), or all projects if none are featured.
   */
  sections: { type: 'posts' | 'projects'; title: string; count: number; linkLabel: string }[];
}

export const HOME: HomeConfig = {
  eyebrow: `${SITE.role} · ${SITE.location}`,
  headline: "Hi, I'm Alex. I build reliable software for the web.",
  intro:
    'I work on developer platforms, distributed systems and the occasional pixel. This is where I write about what I learn and keep track of what I build.',
  actions: [
    { label: 'See my work', href: '/projects/', primary: true },
    { label: 'Resume', href: '/resume/' },
  ],
  showSocials: true,
  avatar: { light: avatar, dark: avatarDark, alt: `Portrait of ${SITE.author}` },
  sections: [
    { type: 'posts', title: 'Recent writing', count: 5, linkLabel: 'All posts' },
    { type: 'projects', title: 'Selected projects', count: 4, linkLabel: 'All projects' },
  ],
};

export const NAV = [
  { label: 'Blog', href: '/blog/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Resume', href: '/resume/' },
  { label: 'About', href: '/about/' },
];

// `icon` must match a key in src/components/Icon.astro
export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { label: 'Mastodon', href: 'https://mastodon.social/', icon: 'mastodon' },
  { label: 'RSS', href: '/rss.xml', icon: 'rss' },
] as const;
