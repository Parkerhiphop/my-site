import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import { getAllTags } from '@/lib/tags';
import kebabCase from '@/lib/utils/kebabCase';

import useTranslation from 'next-translate/useTranslation';

export async function getStaticProps({ defaultLocale, locale, locales }) {
  const tags = await getAllTags(locale);

  return { props: { tags, locale, availableLocales: locales } };
}

export default function Tags({ tags, locale, availableLocales }) {
  const { t } = useTranslation();
  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:tags')} - ${siteMetadata.author}`}
        description={t('SEO:tags')}
        availableLocales={availableLocales}
      />
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1>{t('headerNavLinks:tags')}</h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tags.length === 0 && 'No tags found.'}
          {tags.map((t) => {
            return (
              <div key={t} className="mt-2 mb-2 mr-5">
                <Tag text={t.name} />
                <Link
                  href={`/tags/${kebabCase(t.name)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                >
                  {` (${t.count})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
