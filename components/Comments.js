import Script from 'next/script';
import React from 'react';

import siteMetadata from '@/data/siteMetadata';

const getPostPageId = ({ category, slug }) => `${category}/${slug}`;
const getPageUrl = (pageId) => `${siteMetadata.siteUrl}/${pageId}`;

export default function Comments({ category, slug, pageId: customPageId, pageUrl, title, locale }) {
  const websiteId = siteMetadata.comments?.hyvorTalkWebsiteId;
  const pageId = customPageId || (category && slug ? getPostPageId({ category, slug }) : null);

  if (!websiteId || !pageId) return null;

  return (
    <section id="comments" className="pt-8">
      <Script
        async
        src="https://talk.hyvor.com/embed/embed.js"
        strategy="lazyOnload"
        type="module"
      />
      {React.createElement('hyvor-talk-comments', {
        key: `${pageId}-${locale}`,
        'website-id': String(websiteId),
        'page-id': pageId,
        'page-url': pageUrl || getPageUrl(pageId),
        'page-title': title,
        'page-language': locale,
        colors: 'os',
        loading: 'lazy',
      })}
    </section>
  );
}
