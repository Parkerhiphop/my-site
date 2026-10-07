import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import formatDate from '@/lib/utils/formatDate';
import getAllPosts from '@/lib/utils/getAllPosts';
import useTranslation from 'next-translate/useTranslation';

const copy = {
  'zh-TW': { postsUnit: '篇文章', start: '這是起點！' },
  en: { postsUnit: 'posts', start: "It's Jumping-off Point!" },
  ja: { postsUnit: 'posts', start: 'これがスタート地点です！' },
};

const categoryStyles = {
  life: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/70',
  stream:
    'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/70',
  review:
    'bg-violet-50 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/70',
};

function CategoryBadge({ category }) {
  const { t } = useTranslation();

  return (
    <Link
      href={'/' + category}
      className={
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium transition duration-200 ' +
        (categoryStyles[category] ||
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800')
      }
    >
      <span>{siteMetadata.iconMap[category]}</span>
      {t('headerNavLinks:' + category)}
    </Link>
  );
}

export async function getStaticProps({ locale, locales }) {
  const posts = await getAllPosts(locale);
  const text = copy[locale] || copy['zh-TW'];
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4))), '👆 ' + text.start];
  const postsByYear = years.map((year) => ({
    year,
    posts: posts
      .filter((post) => post.date.startsWith(year))
      .map((post) => ({
        category: post.category,
        slug: post.slug,
        title: post.title,
        date: post.date,
        summary: post.summary || post.description || '',
      })),
  }));

  return { props: { postsByYear, locale, availableLocales: locales } };
}

export default function Timeline({ postsByYear, locale, availableLocales }) {
  const text = copy[locale] || copy['zh-TW'];

  return (
    <>
      <PageSEO
        title={'Timeline - ' + siteMetadata.author}
        description={siteMetadata.description[locale]}
        availableLocales={availableLocales}
      />
      <div>
        <h1 className="heading-1">Timeline</h1>
        <ul>
          {!postsByYear.length && '🚧'}
          {postsByYear.map((postByYear) => (
            <li
              key={postByYear.year}
              className="border-t border-gray-200 pt-4 first:border-t-0 dark:border-gray-700 md:pt-8"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-2xl text-primary-500 md:text-3xl">{postByYear.year}</span>
                {postByYear.posts.length > 0 && (
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {postByYear.posts.length} {text.postsUnit}
                  </span>
                )}
              </div>
              <ul className="border-l-4 border-primary-500 my-4 md:my-8 pl-4">
                {postByYear.posts.map(({ category, slug, date, title, summary }) => (
                  <li key={category + '-' + slug} className="py-4">
                    <div className="grid gap-2 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-x-4">
                      <div className="flex gap-4">
                        <time
                          className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400"
                          dateTime={date}
                        >
                          {formatDate(date, locale, false)}
                        </time>
                        <div className="block md:hidden mb-3">
                          <CategoryBadge category={category} />
                        </div>
                      </div>
                      <article className="space-y-2">
                        <div className="space-y-3">
                          <div>
                            <div className="hidden md:block mb-3">
                              <CategoryBadge category={category} />
                            </div>
                            <Link
                              href={'/' + category + '/' + slug}
                              className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              <h3 className="heading-3">{title}</h3>
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
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
