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

const wordCountUnit = {
  'zh-TW': '字',
  en: 'words',
  ja: '文字',
};

const tocTitle = {
  'zh-TW': '目錄',
  en: 'Contents',
  ja: '目次',
};

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
  const { category, slug, date, title, cover, coverCaption, showSubstackEmbed, wordCount } =
    frontMatter;
  const categoryLabel = category ? t(`headerNavLinks:${category}`) : '';
  const categoryIcon = siteMetadata.iconMap[category] || '🕸️';
  const description = frontMatter.summary || frontMatter.description;
  const formattedWordCount = new Intl.NumberFormat(locale).format(wordCount || 0);
  const wordCountLabel =
    locale === 'en'
      ? `${formattedWordCount} ${wordCountUnit.en}`
      : `約 ${formattedWordCount} ${wordCountUnit[locale] || wordCountUnit['zh-TW']}`;
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
      <article className="pb-12">
        <header className="border-b border-gray-200 pb-8 pt-6 dark:border-gray-800 md:pb-10 md:pt-12">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              {category && (
                <Link
                  href={`/${category}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-primary-700 transition hover:bg-primary-100 hover:text-primary-800 dark:bg-primary-950/60 dark:text-primary-300 dark:hover:bg-primary-900/70 dark:hover:text-primary-200"
                >
                  <span>{categoryIcon}</span>
                  <span>{categoryLabel}</span>
                </Link>
              )}
              <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">
                /
              </span>
              <time dateTime={date}>{formatDate(new Date(date), locale)}</time>
              <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">
                /
              </span>
              <span>{wordCountLabel}</span>
            </div>
            <h1 className="mt-5 !text-3xl !font-extrabold !leading-tight !tracking-tight !text-gray-950 dark:!text-gray-50 sm:!text-4xl md:!text-5xl md:!leading-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400 md:text-xl md:leading-9">
                {description}
              </p>
            )}
          </div>
          {cover && (
            <figure className="mx-auto mt-8 max-w-5xl md:mt-10">
              <Image
                src={cover}
                alt={title}
                width={1200}
                height={630}
                layout="responsive"
                className="w-full rounded-lg object-cover"
              />
              {coverCaption && (
                <figcaption className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {coverCaption}
                </figcaption>
              )}
            </figure>
          )}
        </header>

        <div className="mx-auto max-w-2xl pt-8 md:pt-10">
          {shouldShowAiTranslationNotice && (
            <aside className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              {t('common:aiTranslationNotice')}
            </aside>
          )}
          <TOCInline toc={toc} title={tocTitle[locale] || tocTitle['zh-TW']} />
          <div className="prose max-w-none pb-8 prose-headings:scroll-mt-24 prose-headings:font-bold prose-h2:mt-12 prose-h2:border-t prose-h2:border-gray-200 prose-h2:pt-8 prose-h2:text-2xl prose-h2:leading-9 prose-h2:text-gray-950 prose-h3:mt-9 prose-h3:text-xl prose-p:my-5 prose-p:leading-[1.8] prose-p:text-gray-700 prose-a:font-semibold prose-a:decoration-primary-300 prose-a:decoration-2 prose-a:underline-offset-4 prose-blockquote:border-l-4 prose-blockquote:border-primary-300 prose-blockquote:bg-primary-50/50 prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:leading-[1.75] prose-blockquote:text-gray-700 prose-li:my-1.5 prose-li:leading-[1.75] prose-ul:my-5 prose-ol:my-5 prose-img:rounded-lg dark:prose-dark dark:prose-h2:border-gray-800 dark:prose-h2:text-gray-50 dark:prose-p:text-gray-300 dark:prose-a:decoration-primary-700 dark:prose-blockquote:border-primary-700 dark:prose-blockquote:bg-primary-950/20 dark:prose-blockquote:text-gray-300">
            {children}
          </div>
          {shouldShowSubstackEmbed && (
            <div className="border-t border-gray-200 py-8 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">
              <p className="mb-4">這篇文章也同步有發在 Substack，歡迎訂閱電子報：</p>
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
          <div className="border-t border-gray-200 py-8 dark:border-gray-800">
            <SponsorSection locale={locale} />
          </div>
          <Comments category={category} slug={slug} title={title} locale={locale} />
        </div>

        <footer className="mx-auto mt-10 max-w-3xl border-t border-gray-200 pt-8 dark:border-gray-800">
          {(next || prev) && (
            <div className="grid gap-3 md:grid-cols-2">
              {prev && (
                <Link
                  href={`/${prev.category}/${prev.slug}`}
                  className="group rounded-lg border border-gray-200 p-4 transition hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-800 dark:hover:border-primary-800 dark:hover:bg-primary-950/20"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t('common:preva')}
                  </span>
                  <span className="mt-2 block text-base font-bold leading-7 text-gray-900 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
                    {prev.title}
                  </span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/${next.category}/${next.slug}`}
                  className="group rounded-lg border border-gray-200 p-4 transition hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-800 dark:hover:border-primary-800 dark:hover:bg-primary-950/20 md:text-right"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t('common:nexta')}
                  </span>
                  <span className="mt-2 block text-base font-bold leading-7 text-gray-900 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          )}
          <div className="pt-6">
            <Link
              href={`/${category}`}
              className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-50 dark:border-gray-800 dark:text-primary-300 dark:hover:border-primary-800 dark:hover:bg-primary-950/20"
            >
              &larr; {t('common:back')}
            </Link>
          </div>
        </footer>
      </article>
    </SectionContainer>
  );
}
