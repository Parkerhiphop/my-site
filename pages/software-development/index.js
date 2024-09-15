import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';

import useTranslation from 'next-translate/useTranslation';
import { getCategoryProps } from '@/lib/utils/getCategoryProps';

export async function getStaticProps({ locale, locales }) {
  const props = await getCategoryProps({ type: 'software-development', locale, locales });
  return {
    props,
  };
}

export default function SoftwareDevelopment({
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
        title={`${t('headerNavLinks:software-development')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:life-description')}
        availableLocales={availableLocales}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        type="software-development"
        title={t('headerNavLinks:software-development')}
        description={t('headerNavLinks:software-development-description')}
      />
    </>
  );
}
