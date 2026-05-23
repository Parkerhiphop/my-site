// import SocialIcon from '@/components/social-icons'
import { PageSEO } from '@/components/SEO';
import SponsorSection from '@/components/SponsorSection';
import siteMetadata from '@/data/siteMetadata';

import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

export default function AuthorLayout({ children, frontMatter, availableLocales }) {
  const { name, aboutTitle, description } = frontMatter;
  const { t } = useTranslation();
  const { locale } = useRouter();
  const pageTitle = aboutTitle || t('headerNavLinks:about');
  const pageDescription = description || `${t('SEO:about')} - ${name}`;

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:about')} - ${name}`}
        description={pageDescription}
        availableLocales={availableLocales}
      />
      <div className="space-y-10">
        <header className="border-b border-gray-200 pb-8 dark:border-gray-700 md:pt-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {siteMetadata.iconMap.about} {pageTitle}
          </h1>
        </header>

        <div className="mx-auto max-w-3xl pb-10">
          <div className="prose max-w-none prose-h2:border-t prose-h2:border-gray-200 prose-h2:pt-10 prose-h2:text-2xl prose-li:marker:text-primary-500 dark:prose-dark dark:prose-h2:border-gray-700">
            {children}
          </div>
          {!frontMatter.hideSponsor && (
            <div className="mt-10">
              <SponsorSection locale={locale} variant="full" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
