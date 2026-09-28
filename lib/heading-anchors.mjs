import GithubSlugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

// MDX treats bare braces as JavaScript. Escape only ATX heading annotations,
// leaving frontmatter, fenced examples and all other expressions unchanged.
export function prepareHeadingAnchors(source) {
  let fence;
  let frontmatter = false;
  return source
    .split('\n')
    .map((line, index) => {
      if (index === 0 && line.trim() === '---') {
        frontmatter = true;
        return line;
      }
      if (frontmatter) {
        if (line.trim() === '---') frontmatter = false;
        return line;
      }
      const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (fence) {
        if (
          marker &&
          marker[1][0] === fence[0] &&
          marker[1].length >= fence.length &&
          !marker[2].trim()
        )
          fence = undefined;
        return line;
      }
      if (marker) {
        fence = marker[1];
        return line;
      }
      if (/^ {0,3}#{1,6}\s/.test(line)) {
        return line.replace(/\s+\{#([^{}]+)\}(\s*(?:#+\s*)?)$/, ' \\{#$1\\}$2');
      }
      return line;
    })
    .join('\n');
}

export function remarkHeadingAnchors({ exportRef = [] } = {}) {
  return (tree, file) => {
    const headings = [];
    const reserved = new Set();
    const legacySlugger = new GithubSlugger();
    visit(tree, 'heading', (node) => {
      const last = node.children[node.children.length - 1];
      const annotation = last?.type === 'text' && last.value.match(/\s+\{#([^{}]+)\}\s*$/);
      const explicitId = annotation?.[1];
      if (annotation) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(explicitId)) {
          file.fail(
            `Invalid heading ID "${explicitId}"; use lowercase ASCII letters, numbers and hyphens.`,
            node
          );
        }
        if (reserved.has(explicitId)) file.fail(`Duplicate heading ID "${explicitId}".`, node);
        reserved.add(explicitId);
        last.value = last.value.slice(0, annotation.index);
      }
      const value = toString(node);
      headings.push({ node, value, explicitId, legacyId: legacySlugger.slug(value) });
    });
    // Reserve explicit IDs first so generated IDs cannot steal them.
    for (const heading of headings) {
      let id = heading.explicitId;
      if (!id) {
        id = heading.legacyId;
        let suffix = 0;
        while (reserved.has(id)) id = `${heading.legacyId}-${++suffix}`;
        reserved.add(id);
      }
      heading.id = id;
    }
    for (const { node, value, id, legacyId } of headings) {
      node.data ||= {};
      node.data.hProperties = { ...node.data.hProperties, id };
      if (legacyId !== id && !reserved.has(legacyId)) {
        node.data.hProperties['data-legacy-id'] = legacyId;
      }
      exportRef.push({ value, url: `#${id}`, depth: node.depth });
    }
  };
}
