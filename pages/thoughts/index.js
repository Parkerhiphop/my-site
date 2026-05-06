import siteMetadata from '@/data/siteMetadata';
import Link from '@/components/Link';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';

import useTranslation from 'next-translate/useTranslation';
import { getCategoryProps } from '@/lib/utils/getCategoryProps';

export async function getStaticProps({ locale, locales }) {
  const props = await getCategoryProps({ type: 'thoughts', locale, locales });
  return {
    props,
  };
}

export default function Thoughts({
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
        title={`${t('headerNavLinks:thoughts')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:thoughts-description')}
        availableLocales={availableLocales}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        type="thoughts"
        title={t('headerNavLinks:thoughts')}
        description={
          <>
            {t('headerNavLinks:thoughts-description')}{' '}
            <Link
              href="/database"
              className="font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              🗃️ {t('headerNavLinks:database')}
            </Link>
          </>
        }
        filters={[
          { value: 'all', label: t('common:all') },
          { value: 'manga', label: t('thoughts:manga') },
          { value: 'anime', label: t('thoughts:anime') },
          { value: 'movie', label: t('thoughts:movie') },
          { value: 'series', label: t('thoughts:series') },
          { value: 'novel', label: t('thoughts:novel') },
          { value: 'tools', label: t('thoughts:tools') },
        ]}
      />
    </>
  );
}
