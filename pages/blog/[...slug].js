import PageTitle from '@/components/PageTitle';
// import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { formatSlug, getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx';
import { getCurrentLocale } from '@/lib/utils/getCurrentLocale';
import { getBlogPosts } from '@/lib/utils/getBlogPosts';

const DEFAULT_LAYOUT = 'PostLayout';

export async function getStaticPaths({ locales, defaultLocale }) {
  console.log({ locales, defaultLocale });
  const paths = locales
    .map((locale) => {
      const posts = getBlogPosts('blog', locale === defaultLocale ? 'zh-TW' : locale);
      return posts.map((post) => ({
        params: { slug: [post.split('/')[0]] },
        locale,
      }));
    })
    .flat();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ defaultLocale, locales, locale, params }) {
  const currentLocale = getCurrentLocale(locale, defaultLocale);
  const slug = params.slug.join('/');

  console.log({ currentLocale, slug });

  // Get the post with the given slug and locale
  const post = await getFileBySlug('blog', slug, currentLocale);

  console.log({ post });

  // Get all posts to determine previous and next posts
  const allPosts = await getAllFilesFrontMatter('blog', currentLocale);
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === slug);
  const prev = allPosts[postIndex + 1] || null;
  const next = allPosts[postIndex - 1] || null;

  // Get author details if needed
  const authorList = post.frontMatter.authors || ['default'];
  const authorPromise = authorList.map((author) =>
    getFileBySlug('authors', [author], currentLocale)
  );
  const authorDetails = await Promise.all(authorPromise);

  // Check available locales for SEO
  const availableLocales = [];
  await locales.forEach(async (ilocal) => {
    const currentLocale = getCurrentLocale(ilocal, defaultLocale);
    const iAllPosts = await getAllFilesFrontMatter('blog', currentLocale);
    iAllPosts.map((ipost) => {
      if (ipost.slug === post.frontMatter.slug && ipost.slug !== '') availableLocales.push(ilocal);
    });
  });

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
      availableLocales,
    },
  };
}

export default function Blog({ post, authorDetails, prev, next, availableLocales }) {
  const { mdxSource, toc, frontMatter } = post;
  return (
    <>
      {frontMatter.draft !== true ? (
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
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  );
}
