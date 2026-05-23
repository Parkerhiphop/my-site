import { getAllFilesFrontMatter } from '@/lib/mdx';

export async function getCategoryProps({ type, locale, locales }) {
  const posts = await getAllFilesFrontMatter(type, locale);

  return {
    posts,
    locale,
    availableLocales: locales,
  };
}
