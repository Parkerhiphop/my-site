import siteMetadata from '@/data/siteMetadata';
import headerNavLinks from '@/data/headerNavLinks';
import Link from '@/components/Link';
import SectionContainer from '@/components/SectionContainer';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import ThemeSwitch from '@/components/ThemeSwitch';
// import LangSwitch from '@/components/LangSwitch';
import Image from '@/components/Image';

import useTranslation from 'next-translate/useTranslation';

const Layout = ({ children }) => {
  const { t } = useTranslation();

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
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden lg:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {siteMetadata.iconMap[link.title]}{' '}
                  {t(`headerNavLinks:${link.title.toLowerCase()}`)}
                </Link>
              ))}
            </div>
            {/* <LangSwitch /> */}
            <ThemeSwitch />
            <MobileNav iconMap={siteMetadata.iconMap} />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
};

export default Layout;
