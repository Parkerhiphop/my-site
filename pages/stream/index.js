import siteMetadata from '@/data/siteMetadata';
// import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';

import useTranslation from 'next-translate/useTranslation';
// import { getCategoryProps } from '@/lib/utils/getCategoryProps';
import { useState } from 'react';

// export async function getStaticProps({ locale, locales }) {
//   const props = await getCategoryProps({ type: 'stream', locale, locales });
//   return {
//     props,
//   };
// }

export default function Stream({ posts, locale, availableLocales }) {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState('');

  // const filteredBlogPosts = posts.filter((frontMatter) => {
  //   const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ');
  //   return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  // });

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:life')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:stream-description')}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 md:pt-6 pb-8 md:space-y-5">
          <h1>{t('headerNavLinks:stream')}</h1>
          <h2 className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {t('headerNavLinks:stream-description')}
          </h2>
          <div className="relative max-w-lg">
            <input
              aria-label="Search articles"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('common:search')}
              className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
            />
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
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
        <ul className="md:mt-5 md:pt-5">
          <h3>
            準備中{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </h3>
          {/* {displayPosts.map((frontMatter) => {
          const { slug, date, title, summary, tags } = frontMatter;
          return (
            <li key={slug} className="py-6">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                <dl>
                  <dt className="sr-only">{t('common:pub')}</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date, locale)}</time>
                  </dd>
                </dl>
                <div className="space-y-3 xl:col-span-3">
                  <div>
                    <h3 className="text-2xl font-bold leading-8 tracking-tight">
                      <Link href={`/${type}/${slug}`} className="text-gray-900 dark:text-gray-100">
                        {title}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                  <div className="prose max-w-none text-gray-500 dark:text-gray-400">{summary}</div>
                </div>
              </article>
            </li>
          );
        })} */}
        </ul>
      </div>
    </>
  );
}
