import Head from 'next/head';
import { useRouter } from 'next/router';
import siteMetadata from '@/data/siteMetadata';

const generateLinks = (router, availableLocales) =>
  availableLocales.map((locale) => (
    <link
      key={locale}
      rel={
        // Here we do as follow: Default langage is canonical
        // if default langage is not present, we get the first element of the langage array by default
        // Because the functions should be deterministic, it keep the same(s) link as canonical or alternante
        locale === router.defaultLocale
          ? 'canonical'
          : !availableLocales.includes(router.defaultLocale) && locale === availableLocales[0]
          ? 'canonical'
          : 'alternate'
      }
      hrefLang={locale}
      href={`${siteMetadata.siteUrl}${locale === router.defaultLocale ? '' : `/${locale}`}${
        router.asPath
      }`}
    />
  ));

const CommonSEO = ({ title, description, ogType, ogImage, availableLocales }) => {
  const router = useRouter();
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${siteMetadata.siteUrl}${router.asPath}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      {ogImage.constructor.name === 'Array' ? (
        ogImage.map(({ url }) => <meta property="og:image" content={url} key={url} />)
      ) : (
        <meta property="og:image" content={ogImage} key={ogImage} />
      )}
      <meta property="og:locale" content={router.locale} />
      {availableLocales &&
        availableLocales
          .filter((locale) => locale !== router.locale)
          .map((locale) => <meta key={locale} property="og:locale:alternate" content={locale} />)}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {availableLocales && generateLinks(router, availableLocales)}
    </Head>
  );
};

export const PageSEO = ({ title, description, availableLocales }) => {
  const ogImageUrl = `${siteMetadata.siteUrl}/${siteMetadata.socialBanner}`;

  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={ogImageUrl}
      availableLocales={availableLocales}
    />
  );
};

export const BlogSEO = ({
  authorDetails,
  title,
  category,
  slug,
  summary,
  date,
  lastmod,
  url,
  availableLocales,
  locale,
  cover,
}) => {
  const router = useRouter();
  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(lastmod || date).toISOString();

  const ogImage = cover
    ? `${siteMetadata.siteUrl}${cover}`
    : `${siteMetadata.siteUrl}/${category}/${slug}/cover-${locale}.png`;

  let authorList;
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
      };
    });
  } else {
    authorList = {
      '@type': 'Person',
      name: siteMetadata.author,
    };
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: ogImage,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: authorList,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.author,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: summary,
  };

  return (
    <>
      <CommonSEO
        title={title}
        description={summary}
        ogType="article"
        ogImage={ogImage}
        availableLocales={availableLocales}
      />
      <Head>
        {date && <meta property="article:published_time" content={publishedAt} />}
        {lastmod && <meta property="article:modified_time" content={modifiedAt} />}
        {availableLocales && generateLinks(router, availableLocales)}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  );
};
