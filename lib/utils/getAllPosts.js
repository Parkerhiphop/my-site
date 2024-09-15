import { getAllFilesFrontMatter } from '../mdx';

async function getAllPosts(locale) {
  const lifePosts = await getAllFilesFrontMatter('life', locale);
  const readingPosts = await getAllFilesFrontMatter('reading', locale);
  const reviewPosts = await getAllFilesFrontMatter('review', locale);
  const softwarePosts = await getAllFilesFrontMatter('software-development', locale);

  const posts = [...lifePosts, ...readingPosts, ...reviewPosts, ...softwarePosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return posts;
}

export default getAllPosts;
