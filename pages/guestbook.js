import useTranslation from 'next-translate/useTranslation';

import Comments from '@/components/Comments';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';

const guestbookCopy = {
  'zh-TW': {
    title: '簽名板',
    intro: '我一直都很喜歡旅館或是咖啡廳裡的簽名板，這裡也放一個，歡迎你在這裡留下你的足跡！',
    notes: [
      '可以留一句讀後感、近況、推薦給我的作品，或單純說聲你好。',
      '歡迎貼上你的網站、部落格、作品集，讓我順著連結去拜訪。',
      '留言會公開顯示，私人訊息可以用 Email 或其他社群聯絡我。',
    ],
    commentTitle: '留下你的足跡',
  },
  en: {
    title: 'Guestbook',
    intro:
      'I always loved the guestbooks in hostels or coffee shops, so here is one for you to leave your mark!',
    notes: [
      'Leave a thought, a life update, a recommendation, or just a simple hello.',
      'You are welcome to share your website, blog, or portfolio so I can visit back.',
      'Comments are public, so private messages are still better sent by email or socials.',
    ],
    commentTitle: 'Leave your trace',
  },
  ja: {
    title: 'ゲストブック',
    intro: '私はいつも宿題や喫茶店のゲストブックが好きでした。ここにもあなたが残すためのものです！',
    notes: [
      '感想、近況、おすすめ作品、または一言の挨拶だけでも大歓迎です。',
      'あなたのサイト、ブログ、ポートフォリオもぜひ残してください。あとで訪ねに行きます。',
      'コメントは公開されるため、個人的な内容はメールやSNSで送ってください。',
    ],
    commentTitle: '足跡を残す',
  },
};

export async function getStaticProps({ locale, locales }) {
  return { props: { locale, availableLocales: locales } };
}

export default function Guestbook({ locale, availableLocales }) {
  const { t } = useTranslation();
  const copy = guestbookCopy[locale] || guestbookCopy['zh-TW'];
  const title = t('headerNavLinks:guestbook');
  const description = t('headerNavLinks:guestbook-description');

  return (
    <>
      <PageSEO
        title={`${title} - ${siteMetadata.author}`}
        description={description}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <header className="pb-8">
          <h1 className="mt-3">
            {siteMetadata.iconMap.guestbook} {copy.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400">{copy.intro}</p>
        </header>

        <section className="py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {copy.notes.map((note) => (
              <p
                key={note}
                className="border-l-2 border-primary-400 pl-4 text-base leading-7 text-gray-600 dark:border-primary-300 dark:text-gray-400"
              >
                {note}
              </p>
            ))}
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold leading-9 text-gray-900 dark:text-gray-100">
            {copy.commentTitle}
          </h2>
          <Comments
            pageId="guestbook"
            pageUrl={`${siteMetadata.siteUrl}/guestbook`}
            title={title}
            locale={locale}
          />
        </section>
      </div>
    </>
  );
}
