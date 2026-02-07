import { formatSlug, getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx';

import fs from 'fs';
import path from 'path';

export async function getPostSlugProps({ category, locales, locale, params }) {
  const slug = params.slug.join('/');

  // Get the post with the given slug and locale
  const post = await getFileBySlug(category, slug, locale);

  const publicPath = path.join(process.cwd(), 'public');
  const potentialCovers = [
    `cover-${locale}.png`,
    `cover.png`,
    `cover-zh-TW.png`, // Fallback
  ];

  let cover = null;
  for (const coverImg of potentialCovers) {
    const coverPath = path.join(publicPath, category, slug, coverImg);
    if (fs.existsSync(coverPath)) {
      cover = `/${category}/${slug}/${coverImg}`;
      break;
    }
  }

  if (cover) {
    post.frontMatter.cover = cover;
  }

  // Get all posts to determine previous and next posts
  const allPosts = await getAllFilesFrontMatter(category, locale);
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === slug);
  const prev = allPosts[postIndex + 1] || null;
  const next = allPosts[postIndex - 1] || null;

  // Get author details if needed
  const authorList = post.frontMatter.authors || ['me'];
  const authorPromise = authorList.map((author) => getFileBySlug('authors', [author], locale));
  const authorDetails = await Promise.all(authorPromise);

  // Check available locales for SEO
  const availableLocales = [];
  await locales.forEach(async (ilocal) => {
    const iAllPosts = await getAllFilesFrontMatter(category, locale);
    iAllPosts.map((ipost) => {
      if (ipost.slug === post.frontMatter.slug && ipost.slug !== '') availableLocales.push(ilocal);
    });
  });

  return {
    post,
    authorDetails,
    prev,
    next,
    availableLocales,
    locale,
  };
}
