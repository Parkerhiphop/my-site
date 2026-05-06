import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { getPostSlugProps } from '@/lib/utils/getPostSlugProps';
import { getStaticPostPaths } from '@/lib/utils/getStaticPostPaths';

const DEFAULT_LAYOUT = 'PostLayout';

export async function getStaticPaths({ locales, defaultLocale }) {
  const paths = getStaticPostPaths('novel', locales, defaultLocale);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ locales, locale, params }) {
  const props = await getPostSlugProps({ category: 'novel', locales, locale, params });

  return {
    props,
  };
}

export default function NovelSlug({ post, authorDetails, prev, next, availableLocales }) {
  const { mdxSource, toc, frontMatter } = post;
  const layoutProps = {
    layout: frontMatter.layout || DEFAULT_LAYOUT,
    toc,
    mdxSource,
    frontMatter,
    authorDetails,
    prev,
    next,
    availableLocales,
  };

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer {...layoutProps} />
      ) : (
        <div className="mt-24 text-center">
          <h1>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </h1>
        </div>
      )}
    </>
  );
}
