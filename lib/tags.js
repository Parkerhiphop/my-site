import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import kebabCase from './utils/kebabCase';
import { getBlogPosts } from './utils/getBlogPosts';

const root = process.cwd();

export async function getTags(type, currentLocale) {
  const files = await getBlogPosts(type, currentLocale);
  let tagCounts = {};
  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8');
    const { data } = matter(source);
    if (data.tags && data.draft !== true) {
      data.tags.forEach((tag) => {
        const formattedTag = kebabCase(tag);
        tagCounts[formattedTag] = (tagCounts[formattedTag] || 0) + 1;
      });
    }
  });

  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return tags;
}

/**
 *
 * @param {*} locale
 * @returns [{name: string, count: number}]
 */
export async function getAllTags(locale) {
  const lifeTags = await getTags('life', locale);
  const readingTags = await getTags('reading', locale);
  const reviewTags = await getTags('review', locale);
  const softwareTags = await getTags('software-development', locale);

  const allTags = [...lifeTags, ...readingTags, ...reviewTags, ...softwareTags];

  return allTags;
}
