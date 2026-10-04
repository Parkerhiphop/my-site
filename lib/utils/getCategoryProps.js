import { getAllFilesFrontMatter } from '@/lib/mdx';
import { getPostCover } from '@/lib/utils/getPostSlugProps';

export async function getCategoryProps({ type, locale, locales }) {
  const posts = await getAllFilesFrontMatter(type, locale);

  return {
    posts: posts.map((post) => ({
      ...post,
      cover: getPostCover(type, post.slug, locale),
    })),
    locale,
    availableLocales: locales,
  };
}
