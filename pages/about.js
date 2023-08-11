import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { getFileBySlug } from '@/lib/mdx';
import { getCurrentLocale } from '@/lib/utils/getCurrentLocale';

const DEFAULT_LAYOUT = 'AuthorLayout';

export async function getStaticProps({ locale, defaultLocale, locales }) {
  const currentLocale = getCurrentLocale(locale, defaultLocale);
  const authorDetails = await getFileBySlug('authors', [`me`], currentLocale);
  return { props: { authorDetails, availableLocales: locales } };
}

export default function About({ authorDetails, availableLocales }) {
  const { mdxSource, frontMatter } = authorDetails;

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout || DEFAULT_LAYOUT}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      availableLocales={availableLocales}
    />
  );
}
