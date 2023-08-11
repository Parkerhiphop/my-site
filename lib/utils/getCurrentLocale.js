export function getCurrentLocale(locale, defaultLocale) {
  return locale !== defaultLocale ? locale : 'zh-TW';
}
