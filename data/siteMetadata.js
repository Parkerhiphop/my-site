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
  email: 'parkerhiphop027@gmail.com',
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
  comment: {
    // If you want to use a commenting system other than giscus you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'cusdis', // supported providers: cusdis, giscus, utterances, disqus
    cusdisConfig: {
      appId: process.env.NEXT_PUBLIC_CUSDIS_APP_ID || '',
      host: process.env.NEXT_PUBLIC_CUSDIS_HOST || 'https://cusdis.com',
    },
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: 'Parkerhiphop/my-site',
      repositoryId: 'R_kgDOJoxeXw',
      category: 'Announcements',
      categoryId: 'DIC_kwDOJoxeX84CYY1E',
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // Place the comment box above the comments. options: bottom, top
      inputPosition: 'bottom',
      // Choose the language giscus will be displayed in. options: en, es, zh-CN, zh-TW, ko, ja etc
      lang: 'en',
      // theme when dark mode
      darkTheme: 'preferred_color_scheme',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
    },
    utterancesConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://utteranc.es/
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO,
      issueTerm: '', // supported options: pathname, url, title
      label: '', // label (optional): Comment 💬
      // theme example: github-light, github-dark, preferred-color-scheme
      // github-dark-orange, icy-dark, dark-blue, photon-dark, boxy-light
      theme: '',
      // theme when dark mode
      darkTheme: '',
    },
    disqusConfig: {
      // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
      shortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME,
    },
  },
  iconMap: {
    life: '💭',
    thoughts: '🎬',
    software: '🧑‍💻',
    novel: '✍️',
    random: '🎲',
    database: '🗃️',
    now: '📍',
    stream: '🌊',
    about: '🙌',
  },
};

module.exports = siteMetadata;
