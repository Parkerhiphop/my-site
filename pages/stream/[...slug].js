import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import { getPostSlugProps } from '@/lib/utils/getPostSlugProps';

const DEFAULT_LAYOUT = 'PostLayout';

export async function getStaticPaths({ locales }) {
  const pathsByLocale = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getAllFilesFrontMatter('stream', locale);
      return posts.map(({ slug }) => ({
        params: { slug: slug.split('/') },
        locale,
      }));
    })
  );

  return {
    paths: pathsByLocale.flat(),
    fallback: false,
  };
}

export async function getStaticProps({ locales, locale, params }) {
  return {
    props: await getPostSlugProps({ category: 'stream', locales, locale, params }),
  };
}

export default function StreamSlug({ post, authorDetails, prev, next, availableLocales }) {
  const { mdxSource, toc, frontMatter } = post;

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout || DEFAULT_LAYOUT}
      toc={toc}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      authorDetails={authorDetails}
      prev={prev}
      next={next}
      availableLocales={availableLocales}
    />
  );
}
