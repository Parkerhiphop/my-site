import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import formatDate from '@/lib/utils/formatDate';
import getAllPosts from '@/lib/utils/getAllPosts';
import useTranslation from 'next-translate/useTranslation';

export async function getStaticProps({ locale, locales }) {
  const posts = await getAllPosts(locale);

  const start = {
    'zh-TW': '這是起點！',
    en: "It's Jumping-off Point!",
    ja: 'これがスタート地点です！',
  };

  const years = [...new Set(posts.map((post) => post.date.split('-')[0])), `👆 ${start[locale]}`];

  const postsByYear = years.map((year) => ({
    year: year,
    posts: posts
      .filter((post) => post.date.split('-')[0] === year)
      .map((post) => ({
        category: post.category,
        slug: post.slug,
        title: post.title,
        date: post.date,
        summary: post.summary,
      })),
  }));

  return { props: { posts: postsByYear, locale, availableLocales: locales } };
}

export default function Home({ posts, locale, availableLocales }) {
  const { t } = useTranslation();
  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description[locale]}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="flex flex-col space-y-2 pb-4 md:pb-8 md:space-y-5">
          <div className="flex items-center justify-between w-full">
            <h1 className="mr-6">{siteMetadata.title} 🕸️</h1>
            <Link
              href="/about"
              locale={locale}
              className="hidden md:flex items-center group cursor-pointer"
            >
              <div className="animate-bounce-right mr-2 text-primary-500 text-xl font-bold">
                &rarr;
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-500 transition-colors duration-200">
                {siteMetadata.iconMap['about']} {t(`headerNavLinks:about`)}
              </div>
            </Link>
          </div>
          <h2 className="text-lg leading-7 text-gray-500 dark:text-gray-400 mb-4">
            {siteMetadata.description[locale]}
          </h2>
          {locale === 'zh-TW' && (
            <a
              className="text-primary-600 dark:text-primary-400"
              href="https://substack.com/@parkerchang"
              target="_blank"
              rel="noopener noreferrer"
            >
              📩 前往 Substack 訂閱我的電子報！
            </a>
          )}
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.map((postByYear) => (
            <div key={postByYear.year} className="pt-4 md:pt-8">
              <span className="text-2xl md:text-3xl text-primary-500">{postByYear.year}</span>
              <ul className=" border-l-4  border-primary-500 my-4 md:my-8 pl-4">
                {postByYear.posts.map(({ category, slug, date, title, summary }) => (
                  <li key={slug} className="py-4">
                    <div className="flex flex-col md:flex-row gap-2 flex-wrap md:flex-nowrap">
                      <div className="flex gap-4 md:basis-1/6">
                        <time
                          className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400"
                          dateTime={date}
                        >
                          {formatDate(date, locale, false)}
                        </time>
                        <div className="block md:hidden mb-3">
                          <Link
                            href={`/${category}`}
                            className={`inline-block py-0.5 px-2 rounded-md text-sm font-medium transition duration-200 ${
                              {
                                life: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800',
                                reading:
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800',
                                review:
                                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800',
                                'software-development':
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800',
                              }[category] ||
                              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span className="mr-1">{siteMetadata.iconMap[category]}</span>
                            {t(`headerNavLinks:${category}`)}
                          </Link>
                        </div>
                      </div>
                      <article className="md:basis-5/6 space-y-2">
                        <div className="space-y-3">
                          <div>
                            <div className="hidden md:block mb-3">
                              <Link
                                href={`/${category}`}
                                className={`inline-block py-0.5 px-2 rounded-md text-sm font-medium transition duration-200 ${
                                  {
                                    life: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800',
                                    reading:
                                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800',
                                    review:
                                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800',
                                    'software-development':
                                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800',
                                  }[category] ||
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                                }`}
                              >
                                <span className="mr-1">{siteMetadata.iconMap[category]}</span>
                                {t(`headerNavLinks:${category}`)}
                              </Link>
                            </div>
                            <Link
                              href={`/${category}/${slug}`}
                              className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              <h3 className="text-lg md:text-2xl font-bold leading-8 tracking-tight">
                                {title}
                              </h3>
                            </Link>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400 hidden md:block">
                            {summary}
                          </div>
                        </div>
                      </article>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}
