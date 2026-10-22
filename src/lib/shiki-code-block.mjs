// Shiki transformer: wraps every highlighted block as
//
//   <div class="code-block" data-language="ts" data-title="config.ts">
//     <div class="code-title">config.ts</div>   ← only for ```lang title="…"
//     <pre class="astro-code">…</pre>
//   </div>
//
// The wrapper gives the copy button (added client-side, see CopyCode.astro)
// and the optional title bar a positioning context outside the scrolling <pre>.
// <CodeTabs> reads `data-title` for its tab labels.

/** @returns {import('shiki').ShikiTransformer} */
export function codeBlock() {
  return {
    name: 'duotone:code-block',
    root(root) {
      const pre = root.children.find((n) => n.type === 'element' && n.tagName === 'pre');
      if (!pre) return;

      const title = this.options.meta?.__raw?.match(/title=["']([^"']+)["']/)?.[1];
      root.children = [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-block'], dataLanguage: this.options.lang, ...(title && { dataTitle: title }) },
          children: [
            ...(title
              ? [{ type: 'element', tagName: 'div', properties: { className: ['code-title'] }, children: [{ type: 'text', value: title }] }]
              : []),
            pre,
          ],
        },
      ];
    },
  };
}
