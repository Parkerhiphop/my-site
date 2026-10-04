import { getAllFilesFrontMatter } from '../mdx';

async function getAllPosts(locale) {
  const lifePosts = await getAllFilesFrontMatter('life', locale);
  const reviewPosts = await getAllFilesFrontMatter('review', locale);
  const streamPosts = await getAllFilesFrontMatter('stream', locale);

  const posts = [...lifePosts, ...reviewPosts, ...streamPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return posts;
}

export default getAllPosts;
