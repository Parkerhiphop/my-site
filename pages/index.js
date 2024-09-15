import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import formatDate from '@/lib/utils/formatDate';
import getAllPosts from '@/lib/utils/getAllPosts';
import useTranslation from 'next-translate/useTranslation';
import generateRss from '@/lib/generate-rss';
import fs from 'fs';
import path from 'path';

export async function getStaticProps({ locale, defaultLocale, locales }) {
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
        tags: post.tags,
        summary: post.summary,
      })),
  }));

  // Generate RSS feed
  if (locale === defaultLocale) {
    const root = process.cwd();
    const rss = generateRss(posts, locale, defaultLocale);
    const rssPath = path.join(root, 'public', 'feed.xml');
    fs.writeFileSync(rssPath, rss);
  }

  return { props: { posts: postsByYear, locale, availableLocales: locales } };
}

export default function Home({ posts, locale, availableLocales }) {
  const { t } = useTranslation();

  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={t('common:description')}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-4 md:pb-8 md:pt-6 md:space-y-5">
          <h1>{siteMetadata.title} 🕸️</h1>
          <h2 className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {t('common:description')}
          </h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.map((postByYear) => (
            <div key={postByYear.year} className="pt-4 md:pt-8">
              <span className="text-2xl md:text-3xl text-primary-500">{postByYear.year}</span>
              <ul className=" border-l-4  border-primary-500 my-4 md:my-8 pl-4">
                {postByYear.posts.map(({ category, slug, date, title, summary, tags }) => (
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
                              href={`/${category}/${slug}`}
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
        </ul>
      </div>
    </>
  );
}
