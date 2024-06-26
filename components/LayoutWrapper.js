/* eslint-disable jsx-a11y/no-onchange */
import siteMetadata from '@/data/siteMetadata';
import headerNavLinks from '@/data/headerNavLinks';
import Logo from '@/data/logo.svg';
import Link from './Link';
import SectionContainer from './SectionContainer';
import Footer from './Footer';
import MobileNav from './MobileNav';
import ThemeSwitch from './ThemeSwitch';
import Image from '@/components/Image';

import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const LayoutWrapper = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, locales } = router;

  const langMap = {
    'zh-TW': '繁體中文',
    en: 'English',
    ja: '日本語',
  };

  // TODO: implement useLocale hook to preserve the state of user's previous selection
  // 目前只有首頁會在 reload 的時候被轉換為預設語言
  const changeLanguage = (e) => {
    const locale = e.target.value;
    // localStorage.setItem('locale', locale)
    router.push(router.asPath, router.asPath, { locale });
  };

  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-10">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  <Image
                    src="/me.png"
                    width="54px"
                    height="54px"
                    alt="avatar"
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                {typeof siteMetadata.headerTitle[locale] === 'string' ? (
                  <div className="hidden h-6 text-2xl font-semibold sm:block">
                    {siteMetadata.headerTitle[locale]}
                  </div>
                ) : (
                  siteMetadata.headerTitle[locale]
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {t(`headerNavLinks:${link.title.toLowerCase()}`)}
                </Link>
              ))}
            </div>
            <select
              onChange={changeLanguage}
              defaultValue={locale}
              style={{ textAlignLast: 'center' }}
              className="text-shadow-sm bg-transparent text-sm tracking-wide text-gray-900 dark:text-gray-100"
            >
              {locales.map((e) => (
                <option value={e} key={e}>
                  {langMap[e]}
                </option>
              ))}
            </select>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
};

export default LayoutWrapper;
