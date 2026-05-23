const siteMetadata = {
  title: "Parker Chang's Web",
  description: {
    'zh-TW':
      '喜歡寫作，在這裡記錄自己的所思所想，若這些想法能給其他人帶來點啟發會很高興。可能會寫軟體開發、生活感想、讀書筆記和對各種作品的感想。',
    en: "I like writing and record my thoughts and ideas here. I'd be happy if I can inspire others during the journey. The topics cover technology, life, reading, and reflections on various works.",
    ja: '私は書くことが好きで、ここに自分の考えや思いを記録しています。もしこれらのアイデアが他の人に少しでもインスピレーションを与えることができれば嬉しいです。ソフトウェア開発、生活の感想、読書ノート、そして様々な作品についての感想などを書くかもしれません。',
  },
  author: 'Parker Chang',
  language: 'zh-TW',
  theme: 'system', // system, dark or light
  siteUrl: 'https://www.parkerchang.life',
  siteRepo: 'https://github.com/Parkerhiphop/my-site',
  siteLogo: 'me.png',
  image: 'me.png',
  socialBanner: 'me.png',
  email: 'path@parkerchang.life',
  github: 'https://github.com/Parkerhiphop',
  twitter: 'https://twitter.com/parkerchang11',
  linkedin: 'https://www.linkedin.com/in/cheng-yi-chang-19b148176/',
  rss: {
    'zh-TW': 'https://www.parkerchang.life/feed.xml',
    en: 'https://www.parkerchang.life/feed.ja.xml',
    ja: 'https://www.parkerchang.life/feed.en.xml',
  },
  locale: 'zh-TW',
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports plausible, simpleAnalytics, umami or googleAnalytics
    plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    simpleAnalytics: false, // true or false
    umamiWebsiteId: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    googleAnalyticsId: 'G-P1Z1ET9WGY', // e.g. UA-000000-2 or G-XXXXXXX
    posthogAnalyticsId: '', // posthog.init e.g. phc_5yXvArzvRdqtZIsHkEm3Fkkhm3d0bEYUXCaFISzqPSQ
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
    // Please add your .env file and modify it according to your selection
    provider: 'buttondown',
  },
  comments: {
    hyvorTalkWebsiteId: 15450,
  },
  iconMap: {
    life: '💭',
    review: '🎬',
    software: '🧑‍💻',
    novel: '✍️',
    random: '🎲',
    guestbook: '✍️',
    database: '🗃️',
    now: '📍',
    stream: '🌊',
    about: '🙌',
  },
};

module.exports = siteMetadata;
