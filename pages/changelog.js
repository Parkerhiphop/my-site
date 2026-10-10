import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import changelog from '@/data/changelog';
import siteMetadata from '@/data/siteMetadata';

const copy = {
  'zh-TW': {
    title: '網站大事紀',
    description: '網站功能與設計的重要變動。',
    updated: '上次更新',
    visit: '看看頁面',
    posts: '文章時間軸',
  },
  en: {
    title: 'Site history',
    description: 'Key changes to this site and its design.',
    updated: 'Last updated',
    visit: 'Visit page',
    posts: 'Article timeline',
  },
  ja: {
    title: 'サイトの歩み',
    description: 'サイトの機能とデザインの主な変更点。',
    updated: '最終更新',
    visit: 'ページを見る',
    posts: '記事のタイムライン',
  },
};

const lastUpdated = '2026-10-10';

export async function getStaticProps({ locale, locales }) {
  return { props: { locale, availableLocales: locales } };
}

export default function Changelog({ locale, availableLocales }) {
  const text = copy[locale] || copy['zh-TW'];
  const years = [...new Set(changelog.map((item) => item.date.slice(0, 4)))];
  const dateLocale = locale === 'zh-TW' ? 'zh-TW' : locale;

  return (
    <>
      <PageSEO
        title={`${text.title} - ${siteMetadata.author}`}
        description={text.description}
        availableLocales={availableLocales}
      />
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-gray-200 pb-7 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
            {text.title}
          </h1>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {text.updated}：<time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
        </header>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {years.map((year) => (
            <section
              key={year}
              aria-labelledby={`year-${year}`}
              className="grid gap-4 py-8 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-8 md:py-10"
            >
              <h2
                id={`year-${year}`}
                className="text-2xl font-bold tracking-tight text-primary-600 dark:text-primary-300 md:text-3xl"
              >
                {year}
              </h2>
              <ol className="relative border-l border-gray-300 pl-6 dark:border-gray-600 md:pl-9">
                {changelog
                  .filter((item) => item.date.startsWith(year))
                  .map((item) => {
                    const [title, description] = item.text[locale] || item.text['zh-TW'];
                    return (
                      <li
                        key={`${item.commit}-${item.text['zh-TW'][0]}`}
                        className="relative pb-7 last:pb-0"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -left-[1.75rem] top-2 h-3 w-3 rounded-full border-[3px] border-white bg-primary-500 dark:border-gray-900 md:-left-[2.56rem]"
                        />
                        <time
                          dateTime={item.date}
                          className="text-xs font-semibold tabular-nums text-gray-500 dark:text-gray-400"
                        >
                          {new Intl.DateTimeFormat(dateLocale, {
                            month: 'long',
                            day: 'numeric',
                          }).format(new Date(`${item.date}T12:00:00Z`))}
                        </time>
                        <h3 className="mt-1 text-lg font-bold leading-snug text-gray-900 dark:text-gray-100 md:text-xl">
                          {title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300 md:text-base">
                          {description}
                        </p>
                        {item.href && (
                          <div className="mt-2 text-xs font-semibold">
                            <Link
                              href={item.href}
                              className="text-primary-600 hover:underline dark:text-primary-300"
                            >
                              {text.visit} →
                            </Link>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ol>
            </section>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6 text-sm dark:border-gray-700">
          <Link
            href="/timeline"
            className="font-semibold text-primary-600 hover:underline dark:text-primary-300"
          >
            {text.posts} →
          </Link>
        </div>
      </div>
    </>
  );
}
