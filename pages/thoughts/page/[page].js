import useTranslation from 'next-translate/useTranslation';
import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import { getCategoryProps } from '@/lib/utils/getCategoryProps';
import { POSTS_PER_PAGE } from '@/data/pagination';

export async function getStaticPaths({ locales, defaultLocale }) {
  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const otherLocale = locale !== defaultLocale ? locale : '';
        const totalPosts = await getAllFilesFrontMatter('thoughts', otherLocale);
        const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE);
        return Array.from({ length: totalPages }, (_, i) => [(i + 1).toString(), locale]);
      })
    )
  ).flat();

  return {
    paths: paths.map(([page, locale]) => ({
      params: {
        page,
      },
      locale,
    })),
    fallback: false,
  };
}

export async function getStaticProps({ locale, locales, params }) {
  const props = await getCategoryProps({
    type: 'thoughts',
    page: params.page,
    locale,
    locales,
  });

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
        description={t('headerNavLinks:thoughts-description')}
      />
    </>
  );
}
