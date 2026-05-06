import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

import siteMetadata from '@/data/siteMetadata';

const Cusdis = ({ frontMatter }) => {
  const ref = useRef(null);
  const { resolvedTheme } = useTheme();
  const { appId, host } = siteMetadata.comment.cusdisConfig;

  useEffect(() => {
    if (!appId || !ref.current) return;

    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = `${host}/js/cusdis.es.js`;
    script.async = true;
    script.defer = true;
    ref.current.appendChild(script);
  }, [appId, host, resolvedTheme]);

  if (!appId) return null;

  return (
    <div className="pt-6 pb-6 text-gray-700 dark:text-gray-300">
      <div
        ref={ref}
        id="cusdis_thread"
        data-host={host}
        data-app-id={appId}
        data-page-id={frontMatter.slug}
        data-page-url={`${siteMetadata.siteUrl}/${frontMatter.category}/${frontMatter.slug}`}
        data-page-title={frontMatter.title}
        data-theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};

export default Cusdis;
