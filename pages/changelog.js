import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import changelog from '@/data/changelog';
import siteMetadata from '@/data/siteMetadata';

const copy = {
  'zh-TW': {
    title: '網站大事紀',
    description: '網站功能與設計的重要變動。',
    updated: '上次更新',
    latest: '最新更新',
    changes: '項變動',
    types: { added: '新增', changed: '調整', fixed: '修正', removed: '移除' },
    posts: '文章時間軸',
  },
  en: {
    title: 'Site history',
    description: 'Key changes to this site and its design.',
    updated: 'Last updated',
    latest: 'Latest',
    change: 'change',
    changes: 'changes',
    types: { added: 'Added', changed: 'Changed', fixed: 'Fixed', removed: 'Removed' },
    posts: 'Article timeline',
  },
  ja: {
    title: 'サイトの歩み',
    description: 'サイトの機能とデザインの主な変更点。',
    updated: '最終更新',
    latest: '最新',
    changes: '件の変更',
    types: { added: '追加', changed: '変更', fixed: '修正', removed: '削除' },
    posts: '記事のタイムライン',
  },
};

const lastUpdated = '2026-10-15';

const typeStyles = {
  added: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  changed: 'bg-primary-50 text-primary-800 dark:bg-primary-950/60 dark:text-primary-300',
  fixed: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  removed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export async function getStaticProps({ locale, locales }) {
  return { props: { locale, availableLocales: locales } };
}

export default function Changelog({ locale, availableLocales }) {
  const text = copy[locale] || copy['zh-TW'];
  const releases = changelog.reduce((groups, item) => {
    const latestGroup = groups[groups.length - 1];
    if (latestGroup?.date === item.date) {
      latestGroup.items.push(item);
    } else {
      groups.push({ date: item.date, items: [item] });
    }
    return groups;
  }, []);
  const years = [...new Set(releases.map((release) => release.date.slice(0, 4)))];

  return (
    <>
      <PageSEO
        title={`${text.title} - ${siteMetadata.author}`}
        description={text.description}
        availableLocales={availableLocales}
      />
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-gray-200 pb-7 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
            {text.title}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {text.updated}：<time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
        </header>

        <nav aria-label={text.title} className="flex flex-wrap gap-2 py-5">
          {years.map((year) => (
            <a
              key={year}
              href={`#year-${year}`}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-600 transition-colors hover:border-primary-400 hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:text-primary-300"
            >
              {year}
            </a>
          ))}
        </nav>

        <div>
          {years.map((year) => (
            <section
              key={year}
              id={`year-${year}`}
              aria-labelledby={`year-heading-${year}`}
              className="scroll-mt-28 border-t border-gray-200 py-8 dark:border-gray-700 md:py-10"
            >
              <h2
                id={`year-heading-${year}`}
                className="mb-2 text-2xl font-bold tracking-tight text-primary-600 dark:text-primary-300 md:text-3xl"
              >
                {year}
              </h2>
              <ol className="divide-y divide-gray-200 dark:divide-gray-700">
                {releases
                  .filter((release) => release.date.startsWith(year))
                  .map((release) => (
                    <li
                      key={release.date}
                      id={`release-${release.date}`}
                      className="grid scroll-mt-28 gap-4 py-7 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <time
                            dateTime={release.date}
                            className="text-base font-bold tabular-nums text-gray-900 dark:text-gray-100"
                          >
                            {release.date.replaceAll('-', '.')}
                          </time>
                          {release.date === releases[0].date && (
                            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[0.7rem] font-semibold text-primary-800 dark:bg-primary-900/60 dark:text-primary-200">
                              {text.latest}
                            </span>
                          )}
                        </div>
                        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                          {release.items.length}{' '}
                          {locale === 'en' && release.items.length === 1
                            ? text.change
                            : text.changes}
                        </span>
                      </div>
                      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                        {release.items.map((item) => {
                          const [title, description] = item.text[locale] || item.text['zh-TW'];
                          return (
                            <li
                              key={`${item.commit}-${item.text['zh-TW'][0]}`}
                              className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-4"
                            >
                              <div>
                                <span
                                  className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
                                    typeStyles[item.type]
                                  }`}
                                >
                                  {text.types[item.type]}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-base font-bold leading-6 text-gray-900 dark:text-gray-100 md:text-lg">
                                  {item.href ? (
                                    <Link
                                      href={item.href}
                                      className="break-words text-primary-600 transition-colors hover:text-primary-700 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-primary-300 dark:hover:text-primary-200"
                                    >
                                      {title}
                                    </Link>
                                  ) : (
                                    title
                                  )}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                                  {description}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
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
