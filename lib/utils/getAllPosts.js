import { getAllFilesFrontMatter } from '../mdx';

async function getAllPosts(locale) {
  const lifePosts = await getAllFilesFrontMatter('life', locale);
  const thoughtsPosts = await getAllFilesFrontMatter('thoughts', locale);
  const softwarePosts = await getAllFilesFrontMatter('software', locale);
  const novelPosts = await getAllFilesFrontMatter('novel', locale);

  const posts = [...lifePosts, ...thoughtsPosts, ...softwarePosts, ...novelPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return posts;
}

export default getAllPosts;
