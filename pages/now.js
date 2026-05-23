import useTranslation from 'next-translate/useTranslation';

import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';

export async function getStaticProps({ locale, locales }) {
  return { props: { locale, availableLocales: locales } };
}

export default function Now({ availableLocales }) {
  const { t } = useTranslation();
  const nowContent = {
    intro: t('now:intro'),
    updatedAt: t('now:updatedAt'),
    updatedAtLabel: t('now:updatedAtLabel'),
    databaseOngoingLink: t('now:databaseOngoingLink'),
    sections: t('now:sections', {}, { returnObjects: true }),
  };

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:now')} - ${siteMetadata.author}`}
        description={nowContent.intro}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 md:pt-6 md:space-y-5">
          <h1>
            {siteMetadata.iconMap.now} {t('headerNavLinks:now')}
          </h1>
        </div>
        <div className="space-y-8 py-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
            {nowContent.updatedAtLabel} {nowContent.updatedAt}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {nowContent.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/70 dark:border-gray-700 dark:bg-gray-900/40 dark:shadow-none"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-xl dark:bg-primary-900/30">
                    {section.icon}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h3>
                </div>
                <ul className="mt-4 space-y-3 text-base leading-7 text-gray-600 dark:text-gray-400">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400 dark:bg-primary-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {section.footer !== undefined && (
                  <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                    {section.footer && `${section.footer} `}
                    <Link
                      href="/database?status=ongoing"
                      className="font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      👉 {nowContent.databaseOngoingLink}
                    </Link>
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
