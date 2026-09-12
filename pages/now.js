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
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-gray-200 pb-10 dark:border-gray-700">
          <h1>
            {siteMetadata.iconMap.now} {t('headerNavLinks:now')}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-700 dark:text-gray-200">
            {nowContent.intro}
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-primary-500">
            {nowContent.updatedAtLabel} {nowContent.updatedAt}
          </p>
        </header>
        <div>
          {nowContent.sections.map((section) => (
            <section
              key={section.title}
              className="grid gap-5 border-b border-gray-200 py-8 last:border-b-0 dark:border-gray-700 md:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.5fr)] md:gap-10 md:py-10"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-xl dark:bg-primary-900/30">
                  {section.icon}
                </span>
                <h2 className="heading-2 relative isolate inline-block after:absolute after:inset-x-[-0.14em] after:bottom-[0.1em] after:-z-10 after:h-[0.42em] after:-rotate-1 after:bg-primary-300/70 dark:after:bg-primary-500/50">
                  {section.title}
                </h2>
              </div>
              <div>
                <ul className="space-y-3 text-base leading-7 text-gray-900 dark:text-white">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400 dark:bg-primary-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {section.footer !== undefined && (
                  <p className="mt-4 text-base leading-7 text-gray-900 dark:text-white">
                    {section.footer && `${section.footer} `}
                    <Link
                      href="/database?status=ongoing"
                      className="font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      👉 {nowContent.databaseOngoingLink}
                    </Link>
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
