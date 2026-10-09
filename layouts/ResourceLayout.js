import { useRouter } from 'next/router';

import Comments from '@/components/Comments';
import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';

export default function ResourceLayout({ children, frontMatter, availableLocales }) {
  const { locale } = useRouter();
  const { title, description, jumpLabel, sections, commentTitle } = frontMatter;

  return (
    <>
      <PageSEO
        title={`${title} - ${siteMetadata.author}`}
        description={description}
        availableLocales={availableLocales}
      />
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-gray-200 pb-8 dark:border-gray-700 md:pb-10">
          <h1 className="heading-1">
            {siteMetadata.iconMap.resource} {title}
          </h1>
          <p className="mt-5 max-w-2xl leading-8 text-gray-600 dark:text-gray-300">{description}</p>
        </header>

        <nav aria-label={jumpLabel} className="border-b border-gray-200 py-6 dark:border-gray-700">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {sections.map(({ label, id }, index) => (
              <li key={id}>
                <Link
                  href={`#${id}`}
                  className="group inline-flex items-baseline gap-2 text-sm font-semibold text-gray-700 hover:text-primary-600 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-gray-200 dark:hover:text-primary-400"
                >
                  <span className="text-xs tabular-nums text-primary-600 dark:text-primary-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="group-hover:underline group-hover:underline-offset-4">
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="prose mx-auto max-w-3xl pt-8 prose-h2:scroll-mt-28 prose-h2:border-t prose-h2:border-gray-200 prose-h2:pt-10 prose-h2:text-2xl prose-h3:scroll-mt-28 prose-li:marker:text-primary-500 dark:prose-dark dark:prose-h2:border-gray-700 md:pt-10">
          {children}
        </article>

        <section className="mx-auto mt-14 max-w-3xl border-t border-gray-200 pt-8 dark:border-gray-700">
          <h2 className="heading-2">{commentTitle}</h2>
          <Comments
            pageId="resource"
            pageUrl={`${siteMetadata.siteUrl}/resource`}
            title={title}
            locale={locale}
          />
        </section>
      </div>
    </>
  );
}
