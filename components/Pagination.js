import Link from '@/components/Link';

import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

export default function Pagination({ totalPages, currentPage }) {
  const router = useRouter();
  const path = router.asPath.split('/')[1];
  const { t } = useTranslation();

  const currentPageInt = parseInt(currentPage);
  const totalPagesInt = parseInt(totalPages);

  const prevPage = currentPageInt - 1 > 0;
  const nextPage = currentPageInt + 1 <= totalPagesInt;

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button rel="previous" className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            {t('common:prevp', { defaultValue: 'Previous' })}
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPageInt - 1 === 1 ? `/${path}/` : `/${path}/page/${currentPageInt - 1}`}
          >
            <button rel="previous">{t('common:prevp')}</button>
          </Link>
        )}
        <span>
          {currentPageInt} / {totalPages}
        </span>
        {!nextPage && (
          <button rel="next" className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            {t('common:nextp', { defaultValue: 'Next' })}
          </button>
        )}
        {nextPage && (
          <Link href={`/${path}/page/${currentPageInt + 1}`}>
            <button rel="next">{t('common:nextp')}</button>
          </Link>
        )}
      </nav>
    </div>
  );
}
