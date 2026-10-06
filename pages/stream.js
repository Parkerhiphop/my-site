import Link from '@/components/Link';
import CategoryHeader from '@/components/CategoryHeader';
import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx';
import useTranslation from 'next-translate/useTranslation';

const copy = {
  'zh-TW': {
    title: '隨筆',
    intro: '紀錄隨筆性質的短文章，也會寫一些零碎想法，專屬我的動態牆。',
    emptyTitle: '近期會開始更新，也會放上之前一些隨筆，敬請期待。',
    articleLink: '留言',
  },
  en: {
    title: 'Stream',
    intro: 'A place for short, informal posts and scattered thoughts—my own personal feed.',
    emptyTitle: "I'll start posting here soon and add some older notes too. Stay tuned.",
    articleLink: 'Comments',
  },
  ja: {
    title: '雑記',
    intro: '気ままな短い文章や、ふと思いついたことを記録する、私だけのタイムラインです。',
    emptyTitle: '近いうちに更新を始め、以前に書いたものも載せていきます。お楽しみに。',
    articleLink: 'コメント',
  },
};

export async function getStaticProps({ locale, locales }) {
  const frontMatters = await getAllFilesFrontMatter('stream', locale);
  const posts = await Promise.all(
    frontMatters.map(async ({ slug }) => {
      const post = await getFileBySlug('stream', slug, locale);
      return { ...post.frontMatter, mdxSource: post.mdxSource };
    })
  );

  return { props: { posts, locale, availableLocales: locales } };
}

export default function Stream({ posts, locale, availableLocales }) {
  const text = copy[locale] || copy['zh-TW'];
  const { t } = useTranslation();
  const formatDate = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <PageSEO
        title={`${text.title} - ${siteMetadata.author}`}
        description={text.intro}
        availableLocales={availableLocales}
      />
      <div className="space-y-8">
        <CategoryHeader type="stream" title={text.title} description={text.intro} />

        <section>
          {!posts.length ? (
            <div className="mx-auto max-w-3xl pt-2 md:pt-4">
              <p className="max-w-2xl text-lg leading-8 text-gray-700 dark:text-gray-300">
                {text.emptyTitle}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
                <Link
                  href="/life"
                  className="text-primary-700 hover:underline dark:text-primary-300"
                >
                  {t('headerNavLinks:life')} <span aria-hidden="true">↗</span>
                </Link>
                <Link
                  href="/review"
                  className="text-primary-700 hover:underline dark:text-primary-300"
                >
                  {t('headerNavLinks:review')} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative ml-3 border-l border-gray-200 dark:border-gray-800 md:mx-auto md:max-w-3xl">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  id={`stream-${post.slug}`}
                  className="group relative ml-7 border-b border-gray-200 py-7 first:pt-0 dark:border-gray-800 md:ml-12 md:py-10"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.12rem] top-8 h-2.5 w-2.5 md:-left-[3.12rem] md:top-12"
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-75 motion-reduce:animate-none" />
                    <span className="relative block h-full w-full rounded-full border-2 border-white bg-primary-500 ring-4 ring-primary-100 transition group-hover:scale-125 dark:border-gray-950 dark:ring-primary-950" />
                  </span>
                  <time
                    className="text-sm font-semibold text-gray-500 dark:text-gray-400"
                    dateTime={post.date}
                  >
                    {formatDate.format(new Date(post.date))}
                  </time>
                  <h2 className="mt-3 text-2xl font-bold leading-snug text-gray-900 dark:text-gray-100">
                    <Link
                      href={`/stream/${post.slug}`}
                      className="hover:text-primary-600 hover:underline dark:hover:text-primary-400"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="mt-4 max-w-2xl">
                    <MDXLayoutRenderer layout="StreamInlineLayout" mdxSource={post.mdxSource} />
                  </div>
                  {post.tags?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-sm text-gray-400 dark:text-gray-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/stream/${post.slug}#comments`}
                    className="mt-5 inline-block text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    {text.articleLink} →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
