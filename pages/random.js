import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import getAllPosts from '@/lib/utils/getAllPosts';

export async function getStaticProps({ locale, locales }) {
  const posts = await getAllPosts(locale);
  const randomPosts = posts.map((post) => ({
    href: `/${post.category}/${post.slug}`,
    title: post.title,
  }));

  return { props: { randomPosts, availableLocales: locales } };
}

export default function Random({ randomPosts, availableLocales }) {
  const router = useRouter();
  const { t } = useTranslation();

  const fallbackPost = useMemo(() => randomPosts[0], [randomPosts]);

  useEffect(() => {
    if (!randomPosts.length) return;

    const randomPost = randomPosts[Math.floor(Math.random() * randomPosts.length)];
    router.replace(randomPost.href);
  }, [randomPosts, router]);

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:random')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:random-description')}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 md:pt-6 md:space-y-5">
          <h1>
            {siteMetadata.iconMap.random} {t('headerNavLinks:random')}
          </h1>
          <h2 className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {fallbackPost
              ? `正在挑選：${fallbackPost.title}`
              : t('headerNavLinks:random-description')}
          </h2>
        </div>
        <div className="py-8">
          <p className="text-lg text-gray-600 dark:text-gray-400">正在打亂書架，請稍候。</p>
        </div>
      </div>
    </>
  );
}
