import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { getFileBySlug } from '@/lib/mdx';
import useTranslation from 'next-translate/useTranslation';

const DEFAULT_LAYOUT = 'AuthorLayout';

export async function getStaticProps({ locale, locales }) {
  const authorDetails = await getFileBySlug('authors', [`me`], locale);
  return { props: { authorDetails, availableLocales: locales } };
}

export default function About({ authorDetails, availableLocales }) {
  const { mdxSource, frontMatter } = authorDetails;
  const { t } = useTranslation();

  return (
    <>
      <MDXLayoutRenderer
        layout={frontMatter.layout || DEFAULT_LAYOUT}
        mdxSource={mdxSource}
        frontMatter={frontMatter}
        availableLocales={availableLocales}
      />
    </>
  );
}
