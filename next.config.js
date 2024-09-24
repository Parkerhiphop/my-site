const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextTranslate = require('next-translate');

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
  frame-src giscus.app
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  // {
  //   key: 'Content-Security-Policy',
  //   value: ContentSecurityPolicy.replace(/\n/g, ''),
  // },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const redirects = [
  {
    source: '/blog/2021-2022',
    destination: '/life/2021-2022',
    statusCode: 301,
  },
  {
    source: '/blog/2022-2023',
    destination: '/life/2022-2023',
    statusCode: 301,
  },
  {
    source: '/blog/2023-2024',
    destination: '/life/2023-2024',
    statusCode: 301,
  },
  {
    source: '/blog/how-to-build-a-fitness-habit',
    destination: '/life/how-to-build-a-fitness-habit',
    statusCode: 301,
  },
  {
    source: '/blog/the-journey-of-my-site',
    destination: '/life/the-journey-of-my-site',
    statusCode: 301,
  },
  {
    source: '/blog/atomic-habits-basic',
    destination: '/reading/atomic-habits-basic',
    statusCode: 301,
  },
  {
    source: '/blog/atomic-habits-note',
    destination: '/reading/atomic-habits-note',
    statusCode: 301,
  },
  {
    source: '/blog/atomic-habits-practice',
    destination: '/reading/atomic-habits-practice',
    statusCode: 301,
  },
  {
    source: '/blog/hokkyoku-departmant-store',
    destination: '/review/hokkyoku-departmant-store',
    statusCode: 301,
  },
  {
    source: '/blog/robot-dream',
    destination: '/review/robot-dream',
    statusCode: 301,
  },
  {
    source: '/blog/wind-breaker-shishitouren',
    destination: '/review/wind-breaker-shishitouren',
    statusCode: 301,
  },
  {
    source: '/blog/design-system',
    destination: '/software-development/design-system',
    statusCode: 301,
  },
  {
    source: '/blog/from-callback-to-async',
    destination: '/software-development/from-callback-to-async',
    statusCode: 301,
  },
  {
    source: '/blog/frontend-framework-101',
    destination: '/software-development/frontend-framework-101',
    statusCode: 301,
  },
  {
    source: '/blog/google-oauth-login',
    destination: '/software-development/google-oauth-login',
    statusCode: 301,
  },
  {
    source: '/blog/my-first-three-year-in-code',
    destination: '/software-development/my-first-three-year-in-code',
    statusCode: 301,
  },
  {
    source: '/blog/talk-about-js-eval',
    destination: '/software-development/talk-about-js-eval',
    statusCode: 301,
  },
  {
    source: '/blog/talk-about-web-font',
    destination: '/software-development/talk-about-web-font',
    statusCode: 301,
  },
];

module.exports = nextTranslate(
  withBundleAnalyzer({
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ];
    },
    async redirects() {
      return redirects;
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      return config;
    },
    i18n: {
      locales: ['en', 'zh-TW', 'ja'],
      defaultLocale: 'zh-TW',
      localeDetection: false,
    },
  })
);
