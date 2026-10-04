import Link from '@/components/Link';
import Image from '@/components/Image';
import CategoryHeader from '@/components/CategoryHeader';

import { useState } from 'react';
import formatDate from '@/lib/utils/formatDate';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const listCopy = {
  'zh-TW': {
    all: '全部',
    showing: '目前顯示',
    of: '/',
    posts: '篇',
    latest: '最新',
    emptyTitle: '沒有符合的文章',
    emptyDescription: '換個關鍵字，或清掉搜尋條件再試一次。',
  },
  en: {
    all: 'All',
    showing: 'Showing',
    of: 'of',
    posts: 'posts',
    latest: 'Latest',
    emptyTitle: 'No matching articles',
    emptyDescription: 'Try another keyword or clear the current filters.',
  },
  ja: {
    all: 'すべて',
    showing: '表示中',
    of: '/',
    posts: '件',
    latest: '最新',
    emptyTitle: '該当する記事がありません',
    emptyDescription: '別のキーワードにするか、検索条件をリセットしてください。',
  },
};

export default function ListLayout({ type, posts, title, description, filters = [] }) {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { t } = useTranslation();
  const { locale } = useRouter();
  const copy = listCopy[locale] || listCopy['zh-TW'];
  const latestPost = posts[0];

  const categoryPosts =
    activeFilter === 'all'
      ? posts
      : posts.filter((frontMatter) => frontMatter.section === activeFilter);

  const filteredBlogPosts = categoryPosts.filter((frontMatter) => {
    const searchContent = `${frontMatter.title || ''} ${frontMatter.summary || ''} ${
      frontMatter.description || ''
    }`;
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <CategoryHeader type={type} title={title} description={description} />

      <section className="space-y-5">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 md:flex-row md:items-end md:justify-between">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {copy.showing} {filteredBlogPosts.length} {copy.of} {posts.length} {copy.posts}
          </p>
          <div className="relative w-full md:max-w-sm">
            <input
              aria-label="Search articles"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('common:search')}
              className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-10 text-gray-900 transition focus:border-primary-500 focus:ring-primary-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
            />
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {filters.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeFilter === 'all'
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-700 dark:hover:text-primary-300'
              }`}
            >
              {copy.all}
            </button>
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-700 dark:hover:text-primary-300'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}

        {!filteredBlogPosts.length && (
          <div className="rounded-lg border border-dashed border-gray-300 px-5 py-10 dark:border-gray-700">
            <p className="text-3xl">🚧</p>
            <h2 className="heading-2 mt-4">{copy.emptyTitle}</h2>
            <p className="mt-2 text-base leading-7 text-gray-500 dark:text-gray-400">
              {copy.emptyDescription}
            </p>
          </div>
        )}

        <ul className="space-y-3 md:space-y-0 md:divide-y md:divide-gray-300 md:dark:divide-gray-700">
          {filteredBlogPosts.map((frontMatter) => {
            const { slug, date, title, summary, description, category, cover } = frontMatter;
            return (
              <li
                key={slug}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors hover:border-primary-200 hover:bg-gray-50/70 dark:border-gray-700 dark:bg-gray-900/30 dark:hover:border-primary-800 dark:hover:bg-gray-900/60 md:overflow-visible md:rounded-md md:border-0 md:bg-transparent md:shadow-none md:hover:bg-gray-50/70 md:dark:bg-transparent md:dark:hover:bg-gray-900/40"
              >
                <article className="group px-4 py-4 md:grid md:grid-cols-[8rem_minmax(0,1fr)_12rem] md:gap-6 md:px-3 md:py-8">
                  <dl className="mb-2 md:mb-0">
                    <dt className="sr-only">{t('common:pub')}</dt>
                    <dd className="text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, locale)}</time>
                    </dd>
                  </dl>
                  <div className="min-w-0">
                    <h2 className="heading-2">
                      <Link
                        href={`/${category}/${slug}`}
                        className="text-gray-950 transition group-hover:text-primary-700 dark:text-gray-50 dark:group-hover:text-primary-300"
                      >
                        {title}
                      </Link>
                    </h2>
                    <div className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400 md:text-lg md:leading-8">
                      {summary || description}
                    </div>
                    <Link
                      href={`/${category}/${slug}`}
                      className="mt-3 inline-flex text-sm font-semibold text-primary-600 transition hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
                    >
                      {t('common:more')} →
                    </Link>
                  </div>
                  {cover && (
                    <Link
                      href={`/${category}/${slug}`}
                      className="relative mt-4 block aspect-[16/9] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 md:mt-0"
                    >
                      <Image
                        src={cover}
                        alt={title}
                        fill
                        sizes="(min-width: 768px) 12rem, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
