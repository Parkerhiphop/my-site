import { TagSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
// import generateRss from '@/lib/generate-rss';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import { getAllTags } from '@/lib/tags';
import { getCurrentLocale } from '@/lib/utils/getCurrentLocale';
import kebabCase from '@/lib/utils/kebabCase';

export async function getStaticPaths({ locales, defaultLocale }) {
  const tags = await Promise.all(
    locales.map(async (locale) => {
      const currentLocale = getCurrentLocale(locale, defaultLocale);
      const tags = await getAllTags('blog', currentLocale);
      return Object.entries(tags).map((k) => [k[0], locale]);
    })
  );

  return {
    paths: tags.flat().map(([tag, locale]) => ({
      params: {
        tag,
      },
      locale,
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params, defaultLocale, locale, locales }) {
  const currentLocale = getCurrentLocale(locale, defaultLocale);
  const allPosts = await getAllFilesFrontMatter('blog', currentLocale);
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
  await locales.forEach(async (ilocal) => {
    const currentLocale = getCurrentLocale(ilocal, defaultLocale);
    const itags = await getAllTags('blog', currentLocale);
    Object.entries(itags).map((itag) => {
      if (itag[0] === params.tag) availableLocales.push(ilocal);
    });
  });

  return { props: { posts: filteredPosts, tag: params.tag, locale, availableLocales } };
}

export default function Tag({ posts, tag, locale, availableLocales }) {
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1);

  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.title}`}
        description={`${tag} tags - ${siteMetadata.title}`}
        availableLocales={availableLocales}
      />
      <ListLayout posts={posts} title={`Tag: ${title}`} />
    </>
  );
}
