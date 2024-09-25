import { TagSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
// import generateRss from '@/lib/generate-rss';
import { getAllTags } from '@/lib/tags';
import getAllPosts from '@/lib/utils/getAllPosts';
import kebabCase from '@/lib/utils/kebabCase';
import useTranslation from 'next-translate/useTranslation';

export async function getStaticPaths({ locales, defaultLocale }) {
  const tags = await Promise.all(
    locales.map(async (locale) => {
      const tags = await getAllTags(locale);
      return tags.map((tag) => [tag.name, locale]);
    })
  );

  const paths = tags.flat().map(([tag, locale]) => ({
    params: {
      tag,
    },
    locale,
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params, defaultLocale, locale, locales }) {
  const allPosts = await getAllPosts(locale);
  const filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  );

  // // rss
  // const root = process.cwd();
  // const rss = generateRss(filteredPosts, locale, defaultLocale, `tags/${params.tag}/feed.xml`)
  // const rssPath = path.join(root, 'public', 'tags', params.tag)
  // fs.mkdirSync(rssPath, { recursive: true })
  // fs.writeFileSync(
  //   path.join(rssPath, `feed${currentLocale === '' ? '' : `.${currentLocale}`}.xml`),
  //   rss
  // )

  // Checking if available in other locale for SEO
  const availableLocales = [];
  await locales.forEach(async (locale) => {
    const tags = await getAllTags(locale);
    tags.map((tag) => {
      if (tag.name === params.tag) availableLocales.push(locale);
    });
  });

  return { props: { posts: filteredPosts, tag: params.tag, locale, availableLocales } };
}

export default function Tag({ locale, posts, tag, availableLocales }) {
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1);

  const tags = {
    'zh-TW': '標籤：',
    en: 'Tags:',
    ja: 'タグ：',
  };

  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.title}`}
        description={`${tag} tags - ${siteMetadata.title}`}
        availableLocales={availableLocales}
      />
      <ListLayout type="tags" posts={posts} title={`${tags[locale]}${title}`} />
    </>
  );
}
