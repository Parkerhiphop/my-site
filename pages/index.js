import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import SponsorSection from '@/components/SponsorSection';
import siteMetadata from '@/data/siteMetadata';
import formatDate from '@/lib/utils/formatDate';
import getAllPosts from '@/lib/utils/getAllPosts';
import useTranslation from 'next-translate/useTranslation';

// TODO: not review yet
const homeCopy = {
  'zh-TW': {
    intro:
      "嗨！我是 Parker！歡迎來到 Parker Chang's Web 中，Web 是網站 🌐，也是蜘蛛的網 🕸️，這裡是把我的一切交織在一起的地方。",
    aboutLink: '👉 更多關於我',
    primaryAction: '從近況開始',
    secondaryAction: '看看作品資料庫',
    picksTitle: '最近喜歡的文章',
    timelineTitle: 'Timeline',
    statsTitle: '目前站上有',
    postsUnit: '篇文章',
    supportTitle: '喜歡這些文字嗎？',
    areaTitle: '我喜歡的區域',
    webLinks: {
      database: {
        title: '作品資料庫',
        description: '目前最喜歡的功能，收錄我看過的作品！',
      },
      guestbook: {
        title: '簽名板',
        description: '走過路過不要錯過，歡迎來簽到！',
      },
      now: {
        title: '近況',
        description: '記錄此刻的位置、練習、喜歡與生活狀態。',
      },
      random: {
        title: '隨機',
        description: '隨機選一篇文章來看！',
      },
    },
    categories: {
      life: '生活',
      review: '感想',
      software: '軟體',
      novel: '小說',
    },
  },
  en: {
    'review-by-me': false,
    intro:
      "Hi! I'm Parker! Welcome to Parker Chang's Web, where Web is both the World Wide Web 🌐 and a spider's web 🕸️. This is where I weave everything about me together.",
    aboutLink: '👉 More about me',
    primaryAction: 'Start with now',
    secondaryAction: 'Browse the database',
    picksTitle: 'Recent Favorite Posts',
    timelineTitle: 'Timeline',
    statsTitle: 'On this site',
    postsUnit: 'posts',
    supportTitle: 'Enjoy the writing?',
    supportLabel: 'Support',
    supportDescription: 'If something here kept you company, you can buy me a boba.',
    supportAction: 'Give me a Boba!',
    areaTitle: 'Favorite Areas',
    webLinks: {
      database: {
        title: 'Works Database',
        description:
          'My current favorite feature: a public index of things I have watched, read, and played.',
      },
      guestbook: {
        title: 'Guestbook',
        description: 'Leave a note, let me know this web reached your side!',
      },
      now: {
        title: 'Now',
        description: 'Where I am, what I am practicing, and what I am enjoying lately.',
      },
      random: {
        title: 'Random',
        description: 'Not sure where to begin? Let the site pick a post for you.',
      },
    },
    categories: {
      life: 'Life',
      review: 'Review',
      software: 'Software',
      novel: 'Novel',
    },
  },
  ja: {
    'review-by-me': true,
    intro:
      "こんにちは！私はパーカーです！Parker Chang's Webへようこそ。Webはワールドワイドウェブ🌐であり、クモの巣🕸️でもあります。ここは私のすべてを織り交ぜる場所です。",
    aboutLink: '👉 もっと詳しく',
    primaryAction: '近況から読む',
    secondaryAction: '作品データベースへ',
    picksTitle: '最近好きな文章',
    timelineTitle: 'Timeline',
    statsTitle: 'このサイトには',
    postsUnit: 'posts',
    supportTitle: '文章を楽しめましたか？',
    supportLabel: '応援',
    supportDescription:
      '何かの考えるきっかけになったなら、Boba を一杯おごってもらえるとうれしいです。',
    supportAction: 'Boba を一杯おごる',
    areaTitle: '好きなエリア',
    webLinks: {
      database: {
        title: '作品データベース',
        description: '今いちばん気に入っている機能。今まで拝見した作品をまとめてあります！',
      },
      guestbook: {
        title: 'ゲストブック',
        description: '見ていくだけでも大歓迎！ぜひチェックしてね！',
      },
      now: {
        title: '近況',
        description: '今いる場所、練習していること、最近好きなものを記録しています。',
      },
      random: {
        title: 'ランダム',
        description: 'どこから読むか迷ったときに、サイトが記事を一つ選びます。',
      },
    },
    categories: {
      life: '生活',
      review: '感想',
      software: 'ソフトウェア',
      novel: '小説',
    },
  },
};

const categoryStyles = {
  life: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/70',
  review:
    'bg-violet-50 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/70',
  software:
    'bg-primary-50 text-primary-800 dark:bg-primary-950/70 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/70',
  novel:
    'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/70',
};

const pinnedPostSlugs = ['ideal-life', 'fear-of-living-well', 'after-homelessness'];

function getPostUrl(post) {
  return `/${post.category}/${post.slug}`;
}

function CategoryBadge({ category }) {
  const { t } = useTranslation();

  return (
    <Link
      href={`/${category}`}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium transition duration-200 ${
        categoryStyles[category] ||
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
      }`}
    >
      <span>{siteMetadata.iconMap[category]}</span>
      {t(`headerNavLinks:${category}`)}
    </Link>
  );
}

export async function getStaticProps({ locale, locales }) {
  const posts = await getAllPosts(locale);

  const start = {
    'zh-TW': '這是起點！',
    en: "It's Jumping-off Point!",
    ja: 'これがスタート地点です！',
  };

  const years = [...new Set(posts.map((post) => post.date.split('-')[0])), `👆 ${start[locale]}`];

  const postsByYear = years.map((year) => ({
    year: year,
    posts: posts
      .filter((post) => post.date.split('-')[0] === year)
      .map((post) => ({
        category: post.category,
        slug: post.slug,
        title: post.title,
        date: post.date,
        summary: post.summary || post.description || '',
      })),
  }));

  const pinnedPosts = pinnedPostSlugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter(Boolean);

  const fallbackPinnedPosts = posts
    .filter((post) => !pinnedPosts.some((pinnedPost) => pinnedPost.slug === post.slug))
    .slice(0, 3 - pinnedPosts.length);

  const stats = ['life', 'software', 'review', 'novel']
    .map((category) => ({
      category,
      count: posts.filter((post) => post.category === category).length,
    }))
    .filter((stat) => stat.count > 0);

  return {
    props: {
      posts: postsByYear,
      pinnedPosts: [...pinnedPosts, ...fallbackPinnedPosts].map((post) => ({
        category: post.category,
        slug: post.slug,
        title: post.title,
        date: post.date,
        summary: post.summary || post.description || '',
      })),
      stats,
      locale,
      availableLocales: locales,
    },
  };
}

export default function Home({ posts, pinnedPosts, stats, locale, availableLocales }) {
  const copy = homeCopy[locale] || homeCopy['zh-TW'];
  const articleCount = stats.reduce((total, stat) => total + stat.count, 0);
  const webLinks = [
    { key: 'database', href: '/database' },
    { key: 'guestbook', href: '/guestbook' },
    { key: 'now', href: '/now' },
    { key: 'random', href: '/random' },
  ];

  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description[locale]}
        availableLocales={availableLocales}
      />
      <div>
        <div className="space-y-4 pb-8 md:space-y-6 md:pb-12">
          <section>
            <div className="space-y-5">
              <h1 className="mr-6 text-2xl leading-10 md:text-4xl md:leading-14">
                {siteMetadata.title} 🕸️
              </h1>
              <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 md:text-xl md:leading-9">
                {copy.intro}{' '}
                <Link
                  href="/about"
                  className="font-semibold text-primary-600 underline decoration-primary-300 underline-offset-4 transition hover:text-primary-700 hover:decoration-primary-500 dark:text-primary-400 dark:decoration-primary-700 dark:hover:text-primary-300"
                >
                  {copy.aboutLink}
                </Link>
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <span>{copy.statsTitle}</span>
                <span>
                  {articleCount} {copy.postsUnit}
                </span>
                {stats.map((stat) => (
                  <Link
                    key={stat.category}
                    href={`/${stat.category}`}
                    className="text-gray-500 underline decoration-gray-300 underline-offset-4 transition hover:text-primary-600 hover:decoration-primary-400 dark:text-gray-400 dark:decoration-gray-600 dark:hover:text-primary-400"
                  >
                    {siteMetadata.iconMap[stat.category]} {copy.categories[stat.category]}{' '}
                    {stat.count}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">
              {copy.areaTitle}
            </h2>
            <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4">
              {webLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="group block border-t border-gray-200 py-3 transition last:border-b hover:text-primary-600 dark:border-gray-700 dark:hover:text-primary-400 md:rounded-lg md:border md:border-gray-200 md:p-5 md:hover:-translate-y-0.5 md:hover:border-primary-300 md:hover:bg-primary-50/40 md:dark:border-gray-700 md:dark:hover:border-primary-700 md:dark:hover:bg-primary-900/20"
                >
                  <div className="text-base font-semibold text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-300">
                    {siteMetadata.iconMap[link.key]} {copy.webLinks[link.key].title}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400 md:mt-3 md:text-base md:leading-7">
                    {copy.webLinks[link.key].description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="space-y-4">
              <div className="max-w-2xl">
                <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">
                  {copy.picksTitle}
                </h2>
              </div>
              <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
                {pinnedPosts.map((post) => (
                  <article
                    key={`${post.category}-${post.slug}`}
                    className="group flex w-[78vw] max-w-[20rem] shrink-0 snap-start flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-600 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900/30 dark:hover:border-primary-700 dark:hover:text-primary-400 md:min-h-[220px] md:w-auto md:max-w-none md:p-5"
                  >
                    <div className="space-y-2 md:space-y-4">
                      <CategoryBadge category={post.category} />
                      <Link href={getPostUrl(post)}>
                        <h3 className="text-lg font-bold leading-7 text-gray-900 transition group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-300 md:text-xl md:leading-8">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="hidden text-base leading-7 text-gray-500 dark:text-gray-400 md:line-clamp-3 md:block">
                        {post.summary}
                      </p>
                    </div>
                    <time
                      className="mt-3 block text-sm font-medium text-gray-400 dark:text-gray-500 md:mt-6"
                      dateTime={post.date}
                    >
                      {formatDate(post.date, locale, false)}
                    </time>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <SponsorSection locale={locale} variant="inline" />
        </div>
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700 md:pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-3xl">
            {copy.timelineTitle}
          </h2>
        </div>
        <ul>
          {!posts.length && '🚧'}
          {posts.map((postByYear) => (
            <div
              key={postByYear.year}
              className="border-t border-gray-200 pt-4 first:border-t-0 dark:border-gray-700 md:pt-8"
            >
              <span className="text-2xl md:text-3xl text-primary-500">{postByYear.year}</span>
              <ul className=" border-l-4  border-primary-500 my-4 md:my-8 pl-4">
                {postByYear.posts.map(({ category, slug, date, title, summary }) => (
                  <li key={slug} className="py-4">
                    <div className="flex flex-col md:flex-row gap-2 flex-wrap md:flex-nowrap">
                      <div className="flex gap-4 md:basis-1/6">
                        <time
                          className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400"
                          dateTime={date}
                        >
                          {formatDate(date, locale, false)}
                        </time>
                        <div className="block md:hidden mb-3">
                          <CategoryBadge category={category} />
                        </div>
                      </div>
                      <article className="md:basis-5/6 space-y-2">
                        <div className="space-y-3">
                          <div>
                            <div className="hidden md:block mb-3">
                              <CategoryBadge category={category} />
                            </div>
                            <Link
                              href={`/${category}/${slug}`}
                              className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              <h3 className="text-lg md:text-2xl font-bold leading-8 tracking-tight">
                                {title}
                              </h3>
                            </Link>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400 hidden md:block">
                            {summary}
                          </div>
                        </div>
                      </article>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}
