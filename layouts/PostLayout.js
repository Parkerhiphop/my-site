import Link from '@/components/Link';
import Image from '@/components/Image';
import SectionContainer from '@/components/SectionContainer';
import { BlogSEO } from '@/components/SEO';

import siteMetadata from '@/data/siteMetadata';
import Comments from '@/components/comments';
import useTranslation from 'next-translate/useTranslation';
import formatDate from '@/lib/utils/formatDate';
import { useRouter } from 'next/router';
import ScrollTopAndComment from '@/components/ScrollTopAndComment';
import TOCInline from '@/components/TOCInline';

const editUrl = (category, fileName) =>
  `${siteMetadata.siteRepo}/blob/master/data/${category}/${fileName}`;

const discussUrl = (category, slug) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/${category}/${slug}`
  )}`;

export default function PostLayout({
  frontMatter,
  toc,
  authorDetails,
  availableLocales,
  next,
  prev,
  children,
}) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { category, slug, fileName, date, title, cover, coverCaption } = frontMatter;

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/${category}/${slug}`}
        authorDetails={authorDetails}
        availableLocales={availableLocales}
        locale={locale}
        {...frontMatter}
      />
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="py-6 mb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">{t('common:pub')}</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(new Date(date), locale)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <h1>{title}</h1>
              </div>
              {cover && (
                <div className="pt-6">
                  <Image
                    src={cover}
                    alt={title}
                    width={1200}
                    height={630}
                    layout="responsive"
                    className="object-cover w-full rounded-lg"
                  />
                  {coverCaption && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                      {coverCaption}
                    </p>
                  )}
                </div>
              )}
            </div>
          </header>
          <div className="pb-8 border-none mx-auto max-w-2xl">
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0">
              <TOCInline toc={toc} />
              <div className="prose max-w-none pb-8 dark:prose-dark !border-0">{children}</div>
              {category !== 'software-development' && locale === 'zh-TW' && (
                <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-4">如果你喜歡我的文字，歡迎訂閱電子報:</p>
                  <div className="flex justify-center">
                    <iframe
                      src="https://parkerhiphop027.substack.com/embed"
                      width="480"
                      height="150"
                      frameBorder="0"
                      scrolling="no"
                    ></iframe>
                  </div>
                </div>
              )}
              {/* <Comments frontMatter={frontMatter} /> */}
            </div>
            <footer className="pt-4 xl:pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium leading-5">
                {(next || prev) && (
                  <div className="flex justify-between xl:grid xl:grid-cols-2 xl:gap-x-6 xl:space-y-0">
                    {prev && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {t('common:preva')}
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.category}/${prev.slug}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div className="text-right xl:text-left">
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {t('common:nexta')}
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.category}/${next.slug}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4">
                <Link
                  href={`/${category}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  &larr; {t('common:back')}
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
