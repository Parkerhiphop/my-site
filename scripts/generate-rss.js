const fs = require('fs');
const path = require('path');
const globby = require('globby');
const matter = require('gray-matter');
const siteMetadata = require('../data/siteMetadata');
const i18nConfig = require('../i18n.json');
const { marked } = require('marked');

// escape
const es = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
const ca = /[&<>'"]/g;

const esca = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};
const pe = (m) => esca[m];

/**
 * Safely escape HTML entities such as `&`, `<`, `>`, `"`, and `'`.
 * @param {string} es the input to safely escape
 * @returns {string} the escaped input, and it **throws** an error if
 *  the input type is unexpected, except for boolean and numbers,
 *  converted as string.
 */
const escape = (es) => {
  if (es == null) {
    throw new TypeError('Cannot escape null or undefined');
  }
  return String(es).replace(ca, pe);
};

const generateRssItem = (post, locale, defaultLocale) => `
  <item>
    <guid>${siteMetadata.siteUrl}${defaultLocale === locale ? '' : '/' + locale}/${post.category}/${
  post.slug
}</guid>
    <title>${escape(post.title)}</title>
    <link>${siteMetadata.siteUrl}${defaultLocale === locale ? '' : '/' + locale}/${post.category}/${
  post.slug
}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
    <content:encoded><![CDATA[${marked(post.content)}]]></content:encoded>
  </item>
`;

(async (page = 'feed.xml') => {
  const { locales, defaultLocale } = i18nConfig;

  const contentFiles = await globby([
    'data/life/**/*.mdx',
    'data/life/**/*.md',
    'data/software-development/**/*.mdx',
    'data/software-development/**/*.md',
    'data/review/**/*.mdx',
    'data/review/**/*.md',
    'data/reading/**/*.mdx',
    'data/reading/**/*.md',
  ]);

  const allPosts = await Promise.all(
    contentFiles.map(async (filePath) => {
      console.log('filePath', filePath);
      const source = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(source);
      const category = filePath.split('/')[1];
      const slug = filePath.split('/')[2];
      const locale = filePath.split('/')[3];

      return {
        ...data,
        category,
        slug,
        locale: locales.includes(locale) ? locale : defaultLocale,
        content,
      };
    })
  );

  for (const locale of locales) {
    const posts = allPosts
      .filter((post) => post.locale === locale)
      .filter((post) => !post.draft)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const rss = `
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
          <title>${escape(siteMetadata.title)}</title>
          <link>${siteMetadata.siteUrl}${defaultLocale === locale ? '' : '/' + locale}</link>
          <description>${siteMetadata.description[locale]}</description>
          <language>${locale}</language>
          <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
          <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          <atom:link href="${siteMetadata.siteUrl}/${page.replace(
      '.xml',
      defaultLocale === locale ? '.xml' : '.' + locale + '.xml'
    )}" rel="self" type="application/rss+xml"/>
          ${posts.map((post) => generateRssItem(post, locale, defaultLocale)).join('')}
        </channel>
      </rss>
    `;

    const outputPath = path.join(
      'public',
      `${page.replace('.xml', defaultLocale === locale ? '.xml' : '.' + locale + '.xml')}`
    );
    fs.writeFileSync(outputPath, rss);
  }
})();
