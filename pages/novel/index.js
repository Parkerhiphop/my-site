import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';

import useTranslation from 'next-translate/useTranslation';
import { getCategoryProps } from '@/lib/utils/getCategoryProps';

export async function getStaticProps({ locale, locales }) {
  const props = await getCategoryProps({ type: 'novel', locale, locales });
  return {
    props,
  };
}

export default function Novel({
  posts,
  locale,
  availableLocales,
  initialDisplayPosts,
  pagination,
}) {
  const { t } = useTranslation();

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:novel')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:novel-description')}
        availableLocales={availableLocales}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        type="novel"
        title={t('headerNavLinks:novel')}
        description={t('headerNavLinks:novel-description')}
      />
    </>
  );
}
