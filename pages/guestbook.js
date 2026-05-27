import useTranslation from 'next-translate/useTranslation';

import Comments from '@/components/Comments';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';

const guestbookCopy = {
  'zh-TW': {
    title: '簽名板',
    intro: '來簽到！',
    notes: [
      '可以單純簽到，也可以分享對我網站的想法、你的近況，推薦作品，也歡迎貼上你的網站、Substack 讓我去拜訪！',
      '留言會公開顯示，私人訊息可以用 Email 或其他社群聯絡我。',
    ],
    commentTitle: '留下你的足跡',
  },
  en: {
    title: 'Guestbook',
    intro: 'Come sign in!',
    notes: [
      'You can simply sign in, share what you think of my site, tell me how you are doing, recommend something, or leave your website or Substack so I can visit!',
      'Comments are public, so private messages are still better sent by email or socials.',
    ],
    commentTitle: 'Leave your trace',
  },
  ja: {
    title: 'ゲストブック',
    intro: 'よかったら記帳していってください！',
    notes: [
      '記帳だけでも、サイトの感想や近況、おすすめ作品の共有でも大歓迎です。あなたのサイトやSubstackもぜひ残してください。あとで遊びに行きます！',
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
          <div className="grid gap-4">
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
