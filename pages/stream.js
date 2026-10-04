import Link from '@/components/Link';
import CategoryHeader from '@/components/CategoryHeader';
import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx';

const copy = {
  'zh-TW': {
    title: 'Stream',
    intro: '紀錄隨筆性質的短文章，也會寫一些零碎想法，專屬我的動態牆。',
    updated: '按時間倒序排列',
    emptyTitle: '近期會開始更新，也會放上之前一些隨筆，敬請期待。',
    articleLink: '單篇連結與留言',
    countUnit: '篇',
  },
  en: {
    title: 'Stream',
    intro: 'A place for short, informal posts and scattered thoughts—my own personal feed.',
    updated: 'Newest first',
    emptyTitle: "I'll start posting here soon and add some older notes too. Stay tuned.",
    articleLink: 'Article link and comments',
    countUnit: 'articles',
  },
  ja: {
    title: 'Stream',
    intro: '気ままな短い文章や、ふと思いついたことを記録する、私だけのタイムラインです。',
    updated: '新しい順',
    emptyTitle: '近いうちに更新を始め、以前の随筆も載せていきます。お楽しみに。',
    articleLink: '記事のリンクとコメント',
    countUnit: '件',
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

        <section className="space-y-8">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {text.updated} <span className="text-gray-300 dark:text-gray-700">·</span>
            {posts.length} {text.countUnit}
          </div>

          {!posts.length ? (
            <div className="border-y border-dashed border-gray-300 pb-4 dark:border-gray-700">
              <h2 className="mt-5">{text.emptyTitle}</h2>
            </div>
          ) : (
            <div className="relative ml-3 border-l border-gray-200 dark:border-gray-800">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  id={`stream-${post.slug}`}
                  className="group relative ml-7 border-b border-gray-200 py-7 first:pt-0 dark:border-gray-800 md:ml-12 md:py-10"
                >
                  <span className="absolute -left-[2.12rem] top-8 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-500 ring-4 ring-primary-100 transition group-hover:scale-125 dark:border-gray-950 dark:ring-primary-950 md:-left-[3.12rem] md:top-12" />
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
                  <div className="mt-4 max-w-3xl">
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
                    href={`/stream/${post.slug}`}
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
