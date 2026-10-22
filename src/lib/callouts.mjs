// Sätteri hast plugin: GitHub-style alerts, rendered as callouts.
//
//   > [!NOTE]
//   > Useful information.
//
//   > [!WARNING] Custom title
//   > Text after the marker becomes the title.
//
// becomes
//
//   <div class="callout callout--note" role="note">
//     <p class="callout-title"><svg …/>Note</p>
//     <p>Useful information.</p>
//   </div>
//
// Works in .md and .mdx (both use the Sätteri processor). Styles live in global.css.
import { defineHastPlugin } from 'satteri';

// Icons are hast elements, not raw SVG strings: MDX output can't contain raw HTML.
const svg = (...shapes) => ({
  type: 'element',
  tagName: 'svg',
  properties: {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ariaHidden: 'true',
  },
  children: shapes.map(([tagName, properties]) => ({ type: 'element', tagName, properties, children: [] })),
});

const TYPES = {
  note: { label: 'Note', icon: svg(['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 11v5M12 8h.01' }]) },
  tip: {
    label: 'Tip',
    icon: svg(['path', { d: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z' }]),
  },
  important: { label: 'Important', icon: svg(['path', { d: 'M4 4h16v12H8l-4 4V4Z' }], ['path', { d: 'M12 7v4M12 13.5h.01' }]) },
  warning: {
    label: 'Warning',
    icon: svg(['path', { d: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z' }], ['path', { d: 'M12 9v4M12 17h.01' }]),
  },
  caution: {
    label: 'Caution',
    icon: svg(['path', { d: 'M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9L7.9 2Z' }], ['path', { d: 'M12 8v4M12 16h.01' }]),
  },
};

const MARKER = /^\s*\[!(note|tip|important|warning|caution)\][ \t]*([^\n]*)(\n|$)/i;

const isElement = (node, tag) => node?.type === 'element' && (!tag || node.tagName === tag);

export function callouts() {
  return defineHastPlugin({
    name: 'duotone:callouts',
    element: {
      filter: ['blockquote'],
      visit(node, ctx) {
        const children = [...node.children];
        const pIndex = children.findIndex((c) => isElement(c));
        const p = children[pIndex];
        if (!isElement(p, 'p') || p.children[0]?.type !== 'text') return;

        const text = p.children[0].value;
        const match = text.match(MARKER);
        if (!match) return;

        const type = match[1].toLowerCase();
        const { label, icon } = TYPES[type];
        // Text after the marker on the same line is a custom title, unless the
        // line continues with inline markup (then it's just body text).
        const lineEnds = match[3] === '\n' || p.children.length === 1;
        const title = lineEnds && match[2].trim() ? match[2].trim() : label;
        const rest = lineEnds ? text.slice(match[0].length) : text.slice(text.indexOf(']') + 1).trimStart();

        // Drop the marker from the first paragraph, and the paragraph itself if nothing is left.
        const body = [{ type: 'text', value: rest }, ...p.children.slice(1)].filter((c) => c.type !== 'text' || c.value !== '');
        const hasBody = body.some((c) => c.type !== 'text' || c.value.trim());
        children.splice(pIndex, 1, ...(hasBody ? [{ ...p, children: body }] : []));

        ctx.replaceNode(node, {
          type: 'element',
          tagName: 'div',
          properties: { className: ['callout', `callout--${type}`], role: 'note' },
          children: [
            {
              type: 'element',
              tagName: 'p',
              properties: { className: ['callout-title'] },
              children: [icon, { type: 'text', value: title }],
            },
            ...children,
          ],
        });
      },
    },
  });
}
