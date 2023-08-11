import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import kebabCase from './utils/kebabCase';
import { getBlogPosts } from './utils/getBlogPosts';

const root = process.cwd();

export async function getAllTags(type, currentLocale) {
  const files = await getBlogPosts(type, currentLocale);
  let tagCount = {};
  // Iterate through each post, putting all found tags into `tags`
  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8');
    const { data } = matter(source);
    if (data.tags && data.draft !== true) {
      data.tags.forEach((tag) => {
        const formattedTag = kebabCase(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      });
    }
  });

  return tagCount;
}
