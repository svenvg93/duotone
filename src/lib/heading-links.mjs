// Sätteri hast plugin: a link icon on h2–h4 to copy/share a link to that section.
//
//   <h2 id="the-pipeline">The pipeline<a class="heading-link" href="#the-pipeline" aria-label="…"><svg …/></a></h2>
//
// Astro gives headings their ids in a plugin that runs after ours, slugged from
// the heading text. We assign the ids here instead, with the same slugger, so
// the link always matches the id (Astro keeps an id that's already set). The
// link holds only an icon, no text, so it doesn't leak into ids, the table of
// contents or search titles. Styles live in global.css.
import Slugger from 'github-slugger';

const LINKED = new Set(['h2', 'h3', 'h4']);

const icon = {
  type: 'element',
  tagName: 'svg',
  properties: {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    width: 16,
    height: 16,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ariaHidden: 'true',
  },
  children: [
    { type: 'element', tagName: 'path', properties: { d: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7' }, children: [] },
    { type: 'element', tagName: 'path', properties: { d: 'M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7' }, children: [] },
  ],
};

export function headingLinks() {
  // A factory runs once per document, so duplicate headings get -1, -2… like Astro's own ids.
  return () => {
    const slugger = new Slugger();
    return {
      name: 'duotone:heading-links',
      element: {
        filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        visit(node, ctx) {
          const text = ctx.textContent(node);
          const id = typeof node.properties?.id === 'string' ? node.properties.id : slugger.slug(text);
          ctx.setProperty(node, 'id', id);
          if (!LINKED.has(node.tagName)) return;

          ctx.appendChild(node, {
            type: 'element',
            tagName: 'a',
            properties: { className: ['heading-link'], href: `#${id}`, ariaLabel: `Link to section: ${text.trim()}` },
            children: [icon],
          });
        },
      },
    };
  };
}
