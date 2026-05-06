import { useMemo, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { PageSEO } from '@/components/SEO';
import Link from '@/components/Link';
import siteMetadata from '@/data/siteMetadata';
import { works } from '@/data/database';

const filters = ['all', 'movie', 'manga', 'series', 'anime', 'novel', 'tools'];

export async function getStaticProps({ locale, locales }) {
  return { props: { locale, availableLocales: locales } };
}

export default function Works({ locale, availableLocales }) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const filteredWorks = useMemo(
    () =>
      works.filter((work) => {
        const matchesFilter = activeFilter === 'all' || work.category === activeFilter;
        const matchesSearch = work.title.toLowerCase().includes(searchValue.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [activeFilter, searchValue]
  );

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:database')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:database-description')}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-4 pb-8 md:pt-6">
          <h1>
            {siteMetadata.iconMap.database} {t('headerNavLinks:database')}
          </h1>
          <h2 className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {t('headerNavLinks:database-description')}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-500 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                {filter === 'all' ? t('common:all') : t(`thoughts:${filter}`)}
              </button>
            ))}
          </div>
          <input
            aria-label="Search works"
            type="text"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t('common:search')}
            className="block w-full max-w-lg rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div className="overflow-x-auto py-6">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Finished</th>
                <th className="py-3 pr-4">Work Date</th>
                <th className="py-3 pr-4">Creator</th>
                <th className="py-3 pr-4">Publisher</th>
                <th className="py-3 pr-4">Rating</th>
                <th className="py-3 pr-4">Tags</th>
                <th className="py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredWorks.map((work) => (
                <tr key={`${work.category}-${work.title}`} className="align-top">
                  <td className="py-4 pr-4 font-semibold text-gray-900 dark:text-gray-100">
                    {work.thought ? (
                      <Link href={work.thought} className="text-primary-500 hover:text-primary-600">
                        {work.title}
                      </Link>
                    ) : (
                      work.title
                    )}
                  </td>
                  <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">
                    {t(`thoughts:${work.category}`)}
                  </td>
                  <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">
                    {work.finishedDate || work.year}
                  </td>
                  <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">{work.workDate}</td>
                  <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">{work.creator}</td>
                  <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">{work.publisher}</td>
                  <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">{work.rating}</td>
                  <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">
                    {work.tags.join(', ')}
                  </td>
                  <td className="py-4 text-gray-600 dark:text-gray-400">{work.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
