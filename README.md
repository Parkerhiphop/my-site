# Parker's Personal Site

Clone from [Unofficial i18n fork](<(https://github.com/GautierArcin/i18n-tailwind-nextjs-starter-blog)>) of the excellent [Tailwind CSS blogging starter template](https://github.com/timlrx/tailwind-nextjs-starter-blog).

<!-- TODO: PR to the Example List-->

## Motivation

Since I want to work abroad at Japan, I wish my site to support Traditional Chinese, English, and Japanese.

Thanks GautierArcin for the template!

## Features

All of the main repo Features &

- Sub-path routing with locale(s)

- Multi-langage post support

- Optimized & flexible multi-locale SEO

### TODO

- [x] 6/01 GA
- [x] 7/16 Table of Contents: https://ithelp.ithome.com.tw/articles/10306476
- [x] 8/06 Comment Area: Giscus
- [x] 8/11 Refactor data/blog
- [x] 8/20 Fix mdx and image issues
- [ ] Social Share
  - [ ] twitter: 可參考這篇文下方：https://yurenju.blog/posts/2023-08-28_taming-the-distraction-monster/
  - [ ] line
  - [ ] facebook
  - [ ] ig(?) -> 仿 medium
- [ ] Sponsor(Buy me a coffee, QRCode)
- [ ] Emotions for Articles: Clap, Like, Thumb, fire, ...
- [ ] Newsletter
- [ ] RSS
- [ ] Migrate blogs
- [ ] Refactor Design System?

### References

1. https://cali.so/blog/8-laws-to-a-successful-engineer#d0f08538662a

## Quick Start Guide

Please follow [main repo](https://github.com/timlrx/tailwind-nextjs-starter-blog)'s' **Quick Start Guide** section for general instructions. This section will only cover what to do to add your own(s) locale(s) to the site.

This repository is furnished with `en` as defaultLocale and with `fr` as additional locale. You can provide as many locales as you want, you'll just add the corresponding translation.

If you add a new translations in `locales` folder, please PR this repo. That might help next users / forks.

1. Add your own locales and default locale in `i18n.json`
2. Add a folder for every locale in the `locales` folder.
3. For each `.json` files (`404.json`, `common.json`, `headerNavLink.json`, ...) in your `/locales/[locale]` folder, provide a translation
4. Complete `data/siteMetadata.js`, adding the localized version for certain field (like `title` or `description`, for example.)
5. Complete the localization of `data/projectData.js`
6. Voilà ! You're done !

## Post

To have localized version for post, please follow this naming convention:

`myPost.md` : default locale

`myPost.[locale].md`: additional locales

Post can be provided in only one locale (that doesn't need to be defaultLocale).

The API routes used in the newsletter component cannot be used in a static site export. You will need to use a form API endpoint provider and substitute the route in the newsletter component accordingly. Other hosting platforms such as Netlify also offer alternative solutions - please refer to their docs for more information.

## Support

Using the template? Support this effort by giving a star on GitHub, sharing your own blog and giving a shoutout on Twitter or becoming a project [sponsor](https://github.com/sponsors/timlrx).

## Licence

[MIT](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/master/LICENSE) © [Timothy Lin](https://www.timlrx.com)
