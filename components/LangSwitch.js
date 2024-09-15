import { useRouter } from 'next/router';

const langMap = {
  'zh-TW': '繁體中文',
  en: 'English',
  ja: '日本語',
};

const LangSwitch = () => {
  const router = useRouter();
  const { locale, locales } = router;

  const changeLanguage = (e) => {
    const locale = e.target.value;

    // Route `/tags/[tag]` will be different by locale
    if (router.asPath.includes('/tags')) {
      router.push(`/${locale}/tags`);
      return;
    }

    // If the route contains pagination, redirect to the same page in the new locale
    if (router.asPath.includes('/page')) {
      router.push(`/${locale}/${router.asPath.split('/')[1]}`);
      return;
    }

    router.push(router.asPath, router.asPath, { locale });
  };

  return (
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
  );
};
export default LangSwitch;
