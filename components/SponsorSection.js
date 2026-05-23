import Link from '@/components/Link';

const bobaUrl = 'https://parkerchang.bobaboba.me';
const bobaIconUrl =
  'https://s3.ap-southeast-1.amazonaws.com/media.anyonelab.com/images/boba/boba-embed-icon.png';

const sponsorCopy = {
  'zh-TW': {
    eyebrow: 'support',
    title: '關於贊助',
    shortTitle: '請我喝一杯珍奶',
    shortDescription:
      '謝謝你們在注意力寶貴的現在來到我的網🕸️，如果這一趟有所收穫，可以請我喝杯珍奶，對我來說是莫大的鼓勵！',
    intro:
      '謝謝你在這個注意力是一種稀缺的時代，願意駐足來我的網站上逛逛。你可以選擇滑社群媒體或是看短影片，但你來到了這裡，我希望這趟閱讀是值得、有收穫的。',
    paragraphs: [
      '目前還沒有要靠創作吃飯，但如果有讀者因為我的內容而願意請我喝珍奶，對我來說是莫大的鼓勵。',
      '為了確保閱讀體驗，我不會在這個網站上放任何廣告。贊助平台 BobaME 也可以留言，我會定期同步在這裡；不用贊助也可以去簽名板簽到。',
      '我會持續思考、精進，看看我的作品能帶給你們什麼，也努力讓我的作品值得喝杯珍奶。',
    ],
    action: '請我喝珍奶！',
    guestbookAction: '去簽名板',
  },
  en: {
    eyebrow: 'support',
    title: 'About Support',
    shortTitle: 'Give me a Boba!',
    shortDescription:
      'Thank you for arriving at my web 🕸️ in a time when attention is precious. If this visit felt worthwhile, buying me a boba would mean a lot!',
    intro:
      'Thank you for stopping by in a time when attention is a scarce resource. You could be scrolling through social media or watching short videos, but you came here, and I hope this reading experience is worthwhile and rewarding.',
    paragraphs: [
      'I am not trying to make a living from writing right now, but if my work made someone want to buy me a boba, that would mean a lot.',
      'To protect the reading experience, I do not put ads on this site. BobaME also supports messages, and I will periodically bring those notes back here. You can also sign the guestbook without sponsoring.',
      'I will keep thinking, improving, and trying to make work that is worth your time and maybe worth a boba.',
    ],
    action: 'Give me a Boba!',
    guestbookAction: 'Sign the guestbook',
  },
  ja: {
    eyebrow: 'support',
    title: '応援について',
    shortTitle: 'Boba を一杯おごる',
    shortDescription:
      '注意力が貴重な今、この Web 🕸️ に来てくれてありがとうございます。もし何か得られるものがありましたら、Boba を一杯おごってもらえると大きな励みになります！',
    intro:
      '注意力が貴重になった時代に、このサイトへ立ち寄ってくれてありがとうございます。SNS や短い動画を見ることもできる中で、ここに来てくれた時間が少しでもよいものになればうれしいです。',
    paragraphs: [
      '今のところ創作だけで生活しようとしているわけではありませんが、もし文章を読んで Boba を一杯おごりたいと思ってもらえたら、とても大きな励みになります。',
      '読む体験を守るため、このサイトには広告を置きません。BobaME ではメッセージも残せるので、定期的にここにも反映していきます。応援しなくても、ゲストブックに足跡を残してもらえるとうれしいです。',
      'これからも考え、改善しながら、自分の作品が何を届けられるのかを探していきます。',
    ],
    action: 'Boba を一杯おごる',
    guestbookAction: 'ゲストブックへ',
  },
};

export function BobaButton({ children }) {
  return (
    <a
      className="inline-flex h-10 w-fit min-w-[164px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-accent-200 bg-white px-4 py-2 text-sm font-semibold text-accent-700 no-underline backdrop-blur-[20px] transition hover:border-accent-500 hover:bg-accent-50 hover:text-accent-800 hover:no-underline dark:border-accent-900 dark:bg-gray-900 dark:text-accent-300 dark:hover:border-accent-400 dark:hover:bg-accent-950/30 dark:hover:text-accent-200"
      href={bobaUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span
        aria-hidden="true"
        className="h-full w-6 shrink-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bobaIconUrl})` }}
      />
      <span>{children}</span>
    </a>
  );
}

export default function SponsorSection({ locale = 'zh-TW', variant = 'short' }) {
  const copy = sponsorCopy[locale] || sponsorCopy['zh-TW'];

  if (variant === 'inline') {
    return (
      <section className="rounded-lg border border-accent-100 bg-accent-50/30 p-4 dark:border-accent-900/70 dark:bg-accent-950/10">
        <p className="text-sm font-semibold uppercase text-accent-500 dark:text-accent-400">
          {copy.eyebrow}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
            {copy.shortDescription}
          </p>
          <BobaButton>{copy.action}</BobaButton>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-accent-100 bg-accent-50/30 p-5 dark:border-accent-900/70 dark:bg-accent-950/10">
      <p className="text-sm font-semibold uppercase text-accent-500 dark:text-accent-400">
        {copy.eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {variant === 'full' ? copy.title : copy.shortTitle}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-400">
        {variant === 'full' ? (
          <>
            <p>{copy.intro}</p>
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </>
        ) : (
          <p>{copy.shortDescription}</p>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <BobaButton>{copy.action}</BobaButton>
        {variant === 'full' && (
          <Link
            href="/guestbook"
            className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary-400 hover:text-primary-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary-500 dark:hover:text-primary-400"
          >
            ✍️ {copy.guestbookAction}
          </Link>
        )}
      </div>
    </section>
  );
}
