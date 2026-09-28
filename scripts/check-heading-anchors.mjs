import fs from 'node:fs';
import path from 'node:path';
import { bundleMDX } from 'mdx-bundler';
import { prepareHeadingAnchors, remarkHeadingAnchors } from '../lib/heading-anchors.mjs';

process.env.NODE_ENV ||= 'test';
const groups = new Map();
let files = 0;
let headings = 0;
let failed = false;

async function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(file);
    } else if (/^(zh-TW|en|ja)\.mdx?$/.test(entry.name)) {
      const toc = [];
      try {
        await bundleMDX({
          source: prepareHeadingAnchors(fs.readFileSync(file, 'utf8')),
          cwd: path.resolve('components'),
          xdmOptions(options) {
            options.remarkPlugins = [
              ...(options.remarkPlugins || []),
              [remarkHeadingAnchors, { exportRef: toc }],
              () => (tree, vfile) => {
                const inspect = (node) => {
                  if (
                    node.type === 'heading' &&
                    !/\{#[a-z0-9-]+\\?\}/.test(
                      vfile.value.slice(node.position.start.offset, node.position.end.offset)
                    )
                  ) {
                    vfile.fail(`Heading needs a permanent {#id} in ${file}`, node);
                  }
                  node.children?.forEach(inspect);
                };
                inspect(tree);
              },
            ];
            return options;
          },
        });
        const group = groups.get(directory) || {};
        group[entry.name.replace(/\.mdx?$/, '')] = toc.map((heading) => heading.url);
        groups.set(directory, group);
        files++;
        headings += toc.length;
      } catch (error) {
        failed = true;
        console.error(`${file}: ${error.message}`);
      }
    }
  }
}

await walk('data');
for (const [directory, locales] of groups) {
  const union = new Set(Object.values(locales).flat());
  for (const locale of ['zh-TW', 'en', 'ja']) {
    const missing = [...union].filter((id) => !locales[locale]?.includes(id));
    if (missing.length)
      console.warn(`${directory}/${locale}: no corresponding heading for ${missing.join(', ')}`);
  }
}
console.log(
  `Checked ${files} files and ${headings} headings. Translation differences above require editorial review; no headings were matched by position.`
);
if (failed) process.exitCode = 1;
