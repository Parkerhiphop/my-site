import { getBlogPosts } from './getBlogPosts';
import { formatSlug } from '@/lib/mdx';

export function getStaticPostPaths(category, locales, defaultLocale) {
  return locales
    .map((locale) => {
      const postLocale = locale === defaultLocale ? 'zh-TW' : locale;
      const posts = getBlogPosts(category, postLocale);

      return posts.map((post) => ({
        params: { slug: formatSlug(post).split('/') },
        locale,
      }));
    })
    .flat();
}
