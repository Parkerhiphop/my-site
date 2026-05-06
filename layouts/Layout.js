import siteMetadata from '@/data/siteMetadata';
import headerNavLinks from '@/data/headerNavLinks';
import Link from '@/components/Link';
import SectionContainer from '@/components/SectionContainer';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import ThemeSwitch from '@/components/ThemeSwitch';
import LangSwitch from '@/components/LangSwitch';
import Image from '@/components/Image';

import useTranslation from 'next-translate/useTranslation';

const Layout = ({ children }) => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between gap-4 py-6 md:py-10">
          <div className="flex flex-row gap-2">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="mr-3 flex-shrink-0">
                <Image
                  src="/me.png"
                  width="48"
                  height="48"
                  alt="avatar"
                  className="h-10 w-10 rounded-full"
                />
              </div>
            </Link>
            <nav className="hidden items-center lg:flex gap-4">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-lg font-bold text-gray-900 dark:text-gray-100"
                >
                  {siteMetadata.iconMap[link.title]}{' '}
                  {t(`headerNavLinks:${link.title.toLowerCase()}`)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-3 text-lg leading-5">
            <div className="flex shrink-0 items-center">
              <LangSwitch />
              <ThemeSwitch />
              <MobileNav iconMap={siteMetadata.iconMap} />
            </div>
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
};

export default Layout;
