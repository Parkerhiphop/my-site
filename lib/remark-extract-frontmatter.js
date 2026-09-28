import { visit } from 'unist-util-visit';
import matter from 'gray-matter';

export default function extractFrontmatter() {
  return (tree, file) => {
    visit(tree, 'yaml', (node, index, parent) => {
      file.data.frontmatter = matter(`---\n${node.value}\n---`).data;
    });
  };
}
