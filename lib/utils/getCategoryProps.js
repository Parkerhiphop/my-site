import { getAllFilesFrontMatter } from '@/lib/mdx';

export const POSTS_PER_PAGE = 5;

export async function getCategoryProps({ type, page = 1, locale, locales }) {
  const posts = await getAllFilesFrontMatter(type, locale);

  const currentPage = (page - 1) * POSTS_PER_PAGE;

  const initialDisplayPosts = posts.slice(
    currentPage,
    currentPage + POSTS_PER_PAGE < posts.length ? currentPage + POSTS_PER_PAGE : posts.length
  );

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return {
    posts,
    locale,
    availableLocales: locales,
    initialDisplayPosts,
    pagination,
  };
}
