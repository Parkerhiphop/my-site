import { useEffect, useRef, useState } from 'react';
import Link from './Link';
import headerNavLinks from '@/data/headerNavLinks';

import useTranslation from 'next-translate/useTranslation';

const mobileNavLinks = [
  ...headerNavLinks.slice(0, 3),
  { href: '/timeline', title: 'timeline' },
  ...headerNavLinks.slice(3),
];

const MobileNav = ({ iconMap }) => {
  const { t } = useTranslation();
  const [navShow, setNavShow] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!navShow) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [navShow]);

  const closeNav = () => {
    menuButtonRef.current?.focus();
    setNavShow(false);
  };

  const onToggleNav = () => {
    if (navShow) {
      closeNav();
      return;
    }

    setNavShow(true);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        ref={menuButtonRef}
        className="ml-1 mr-1 h-8 w-8 rounded"
        aria-label="Toggle Menu"
        aria-expanded={navShow}
        aria-controls="mobile-navigation"
        onClick={onToggleNav}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-gray-900 dark:text-gray-100"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        id="mobile-navigation"
        aria-hidden={!navShow}
        className={`fixed inset-0 z-10 flex justify-end bg-black/30 transition-opacity duration-300 dark:bg-black/50 ${
          navShow ? 'visible opacity-100 delay-0' : 'invisible opacity-0 delay-300'
        }`}
        onClick={closeNav}
      >
        <div
          className={`h-full max-h-[100dvh] w-[min(85vw,24rem)] overflow-y-auto overscroll-contain bg-gray-100 shadow-xl transition-transform duration-300 ease-out dark:bg-gray-900 ${
            navShow ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex justify-end px-3 pt-3">
            <button
              type="button"
              className="h-8 w-8 rounded"
              aria-label="Toggle Menu"
              onClick={onToggleNav}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="text-gray-900 dark:text-gray-100"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <nav className="pb-6">
            {mobileNavLinks.map((link) => (
              <div key={link.title} className="px-12 py-3">
                <Link
                  href={link.href}
                  className="text-2xl font-bold leading-snug tracking-wide text-gray-900 dark:text-gray-100"
                  onClick={onToggleNav}
                >
                  {iconMap[link.title]} {t(`headerNavLinks:${link.title.toLowerCase()}`)}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
