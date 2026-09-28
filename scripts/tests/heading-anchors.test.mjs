import assert from 'node:assert/strict';
import test from 'node:test';
import { bundleMDX } from 'mdx-bundler';
import { getMDXComponent } from 'mdx-bundler/client/index.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { prepareHeadingAnchors, remarkHeadingAnchors } from '../../lib/heading-anchors.mjs';

process.env.NODE_ENV ||= 'test';

async function compile(source) {
  const toc = [];
  const { code } = await bundleMDX({
    source: prepareHeadingAnchors(source),
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins || []),
        [remarkHeadingAnchors, { exportRef: toc }],
      ];
      return options;
    },
  });
  return { toc, html: renderToStaticMarkup(React.createElement(getMDXComponent(code))) };
}

test('three translated headings share one ID, with clean formatted labels and legacy IDs', async () => {
  for (const title of ['來日本的理由', 'Why I Came to Japan', '日本に来た理由']) {
    const { toc, html } = await compile(`## **${title}** {#why-japan}`);
    assert.deepEqual(toc, [{ value: title, url: '#why-japan', depth: 2 }]);
    assert.match(html, /id="why-japan"/);
    assert.match(html, /data-legacy-id=/);
    assert.ok(!html.includes('{#'));
  }
});

test('duplicate text gets unique IDs and explicit IDs are reserved first', async () => {
  const { toc } = await compile('## Same\n\n## Same\n\n## Other {#same}');
  assert.deepEqual(
    toc.map((h) => h.url),
    ['#same-1', '#same-1-1', '#same']
  );
  assert.equal(new Set(toc.map((h) => h.url)).size, 3);
  const plain = await compile('## Same\n\n## Same');
  assert.deepEqual(
    plain.toc.map((h) => h.url),
    ['#same', '#same-1']
  );
});

test('reject duplicate and invalid explicit IDs', async () => {
  await assert.rejects(compile('## A {#same}\n\n## B {#same}'), /Duplicate heading ID/);
  await assert.rejects(compile('## A {#非英文}'), /Invalid heading ID/);
});

test('preserve frontmatter and fenced examples, support closing heading markers', async () => {
  const source =
    '---\ntitle: "{#example}"\n---\n\n```md\n## Example {#example}\n```\n\n## Real {#real} ##';
  assert.ok(prepareHeadingAnchors(source).includes('## Example {#example}'));
  const { toc, html } = await compile(source);
  assert.deepEqual(toc, [{ value: 'Real', url: '#real', depth: 2 }]);
  assert.match(html, /Example \{#example\}/);
});

test('RSS headings use the same ID without exposing authoring annotations', async () => {
  const { Marked } = await import('marked');
  const { default: heading } = await import('../../lib/rss-heading.js');
  const marked = new Marked({ renderer: { heading } });
  assert.equal(
    marked.parse('## **來日本的理由** {#why-japan}'),
    '<h2 id="why-japan"><strong>來日本的理由</strong></h2>\n'
  );
  assert.match(marked.parse('```md\n## Example {#example}\n```'), /Example \{#example\}/);
});
