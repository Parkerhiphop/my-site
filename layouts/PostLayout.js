import Link from '@/components/Link';
import Image from '@/components/Image';
import SectionContainer from '@/components/SectionContainer';
import { BlogSEO } from '@/components/SEO';

import siteMetadata from '@/data/siteMetadata';
import useTranslation from 'next-translate/useTranslation';
import formatDate from '@/lib/utils/formatDate';
import { useRouter } from 'next/router';
import ScrollTopAndComment from '@/components/ScrollTopAndComment';
import TOCInline from '@/components/TOCInline';
import Comments from '@/components/Comments';
import SponsorSection from '@/components/SponsorSection';

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
  const { category, slug, date, title, cover, coverCaption, showSubstackEmbed } = frontMatter;
  const shouldShowAiTranslationNotice = locale !== 'zh-TW' && frontMatter['review-by-me'] !== true;
  const shouldShowSubstackEmbed = locale === 'zh-TW' && showSubstackEmbed;

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
              {shouldShowAiTranslationNotice && (
                <aside className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                  {t('common:aiTranslationNotice')}
                </aside>
              )}
              <TOCInline toc={toc} />
              <div className="prose max-w-none pb-8 prose-p:my-4 prose-p:leading-[1.65] prose-li:my-1 prose-li:leading-[1.65] prose-ul:my-4 prose-ol:my-4 prose-blockquote:leading-[1.65] dark:prose-dark !border-0">
                {children}
              </div>
              {shouldShowSubstackEmbed && (
                <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-4">這篇文章也同步有發在 Substack 歡迎訂閱電子報：</p>
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
              <div className="py-8">
                <SponsorSection locale={locale} />
              </div>
              <Comments category={category} slug={slug} title={title} locale={locale} />
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
