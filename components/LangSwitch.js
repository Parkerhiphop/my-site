import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from './Link';

const langMap = {
  'zh-TW': '繁中',
  en: 'EN',
  ja: '日本語',
};

const LangSwitch = () => {
  const router = useRouter();
  const { locale, locales } = router;
  const [anchorPath, setAnchorPath] = useState(null);

  useEffect(() => {
    const syncAnchor = () => {
      let hash = window.location.hash;
      try {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        const canonicalId = target?.dataset.anchorId;
        if (canonicalId) {
          hash = `#${canonicalId}`;
          // Next's initial fragment handling can miss encoded legacy IDs.
          document.getElementById(canonicalId)?.scrollIntoView({ block: 'start' });
        }
      } catch {
        // Preserve malformed fragments rather than breaking language navigation.
      }
      setAnchorPath({ source: router.asPath, href: router.asPath.split('#')[0] + hash });
    };
    syncAnchor();
    window.addEventListener('hashchange', syncAnchor);
    return () => window.removeEventListener('hashchange', syncAnchor);
  }, [router.asPath]);

  const href = anchorPath?.source === router.asPath ? anchorPath.href : router.asPath;

  return (
    <div className="flex items-center gap-1 text-sm font-semibold tracking-wide">
      {locales.map((targetLocale) => {
        const isActive = targetLocale === locale;
        return (
          <Link
            key={targetLocale}
            href={href}
            locale={targetLocale}
            className={`rounded-full px-2 py-1 transition ${
              isActive
                ? 'bg-primary-500 text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400'
            }`}
          >
            {langMap[targetLocale]}
          </Link>
        );
      })}
    </div>
  );
};
export default LangSwitch;
