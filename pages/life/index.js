import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';

import useTranslation from 'next-translate/useTranslation';
import { getCategoryProps } from '@/lib/utils/getCategoryProps';

export async function getStaticProps({ locale, locales }) {
  const props = await getCategoryProps({ type: 'life', locale, locales });
  return {
    props,
  };
}

export default function Life({ posts, locale, availableLocales }) {
  const { t } = useTranslation();

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:life')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:life-description')}
        availableLocales={availableLocales}
      />
      <ListLayout
        posts={posts}
        type="life"
        title={t('headerNavLinks:life')}
        description={t('headerNavLinks:life-description')}
      />
    </>
  );
}
