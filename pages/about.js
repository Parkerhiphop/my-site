import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { getFileBySlug } from '@/lib/mdx';
import { getCurrentLocale } from '@/lib/utils/getCurrentLocale';
import useTranslation from 'next-translate/useTranslation';
import Link from '@/components/Link';

const DEFAULT_LAYOUT = 'AuthorLayout';

export async function getStaticProps({ locale, defaultLocale, locales }) {
  const currentLocale = getCurrentLocale(locale, defaultLocale);
  const authorDetails = await getFileBySlug('authors', [`me`], currentLocale);
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
      <div className="flex justify-center text-base font-medium leading-6 mt-4">
        <Link
          href="/blog"
          className="md:text-xl text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          aria-label="all posts"
        >
          {t('common:all')} &rarr;
        </Link>
      </div>
    </>
  );
}
