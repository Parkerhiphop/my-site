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

  return (
    <div className="flex items-center gap-1 text-sm font-semibold tracking-wide">
      {locales.map((targetLocale) => {
        const isActive = targetLocale === locale;
        return (
          <Link
            key={targetLocale}
            href={router.asPath}
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
