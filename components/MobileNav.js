import { useEffect, useState } from 'react';
import Link from './Link';
import headerNavLinks from '@/data/headerNavLinks';

import useTranslation from 'next-translate/useTranslation';

const MobileNav = ({ iconMap }) => {
  const { t } = useTranslation();
  const [navShow, setNavShow] = useState(false);

  useEffect(() => {
    if (!navShow) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [navShow]);

  const onToggleNav = () => setNavShow((status) => !status);

  return (
    <div className="lg:hidden">
      <button
        type="button"
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
      {navShow && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-10 overflow-y-auto overscroll-contain bg-gray-100/95 dark:bg-gray-900/95"
        >
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-5 mt-11 h-8 w-8 rounded"
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
          <nav className="mt-10 pb-12">
            {headerNavLinks.map((link) => (
              <div key={link.title} className="px-12 py-5">
                <Link
                  href={link.href}
                  className="text-3xl font-bold leading-relaxed tracking-wide text-gray-900 dark:text-gray-100"
                  onClick={onToggleNav}
                >
                  {iconMap[link.title]} {t(`headerNavLinks:${link.title.toLowerCase()}`)}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
