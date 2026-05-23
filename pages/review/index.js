import siteMetadata from '@/data/siteMetadata';
import Link from '@/components/Link';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';

import useTranslation from 'next-translate/useTranslation';
import { getCategoryProps } from '@/lib/utils/getCategoryProps';

export async function getStaticProps({ locale, locales }) {
  const props = await getCategoryProps({ type: 'review', locale, locales });
  return {
    props,
  };
}

export default function Review({ posts, locale, availableLocales }) {
  const { t } = useTranslation();

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:review')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:review-description')}
        availableLocales={availableLocales}
      />
      <ListLayout
        posts={posts}
        type="review"
        title={t('headerNavLinks:review')}
        description={
          <>
            {t('headerNavLinks:review-description')}{' '}
            <Link
              href="/database"
              className="font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              🗃️ {t('headerNavLinks:database')}
            </Link>
          </>
        }
      />
    </>
  );
}
