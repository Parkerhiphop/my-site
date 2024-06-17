import Link from '@/components/Link';
import Tag from '@/components/Tag';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import siteMetadata from '@/data/siteMetadata';
import { PageSEO } from '@/components/SEO';
import formatDate from '@/lib/utils/formatDate';

import useTranslation from 'next-translate/useTranslation';
import { getCurrentLocale } from '@/lib/utils/getCurrentLocale';
import { useState } from 'react';

export const POSTS_PER_PAGE = 5;

export async function getStaticProps({ locale, defaultLocale, locales }) {
  const currentLocale = getCurrentLocale(locale, defaultLocale);
  const posts = await getAllFilesFrontMatter('blog', currentLocale);

  return {
    props: {
      posts,
      locale,
      availableLocales: locales,
    },
  };
}

export default function Blog({ posts, locale, availableLocales }) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const filteredPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ');
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  const years = [...new Set(filteredPosts.map((post) => post.date.split('-')[0]))];

  const postsByYear = years.map((year) => ({
    year: year,
    posts: filteredPosts
      .filter((post) => post.date.split('-')[0] === year)
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        tags: post.tags,
        summary: post.summary,
      })),
  }));

  return (
    <>
      <PageSEO
        title={`Blog - ${siteMetadata.author}`}
        description={siteMetadata.description[locale]}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-6xl md:leading-14">
            {t('common:all')}
          </h1>
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
      </div>
      {postsByYear.map((postByYear) => (
        <div key={postByYear.year}>
          <h2 className="text-2xl md:text-3xl text-primary-500">{postByYear.year}</h2>
          <ul className=" border-l-4  border-primary-500 my-8 pl-4">
            {postByYear.posts.map(({ slug, date, title, summary, tags }) => (
              <li key={slug} className="py-4">
                <div className="flex flex-col md:flex-row gap-2 flex-wrap md:flex-nowrap">
                  <time
                    className="md:basis-1/6 text-base font-medium leading-6 text-gray-500 dark:text-gray-400"
                    dateTime={date}
                  >
                    {formatDate(date, locale, false)}
                  </time>
                  <article className="md:basis-5/6 space-y-2">
                    <div className="space-y-3">
                      <div>
                        <Link
                          href={`/blog/${slug}`}
                          className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <h3 className="text-lg md:text-2xl font-bold leading-8 tracking-tight">
                            {title}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap">
                          {tags.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
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
    </>
  );
}
