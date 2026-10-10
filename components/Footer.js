import siteMetadata from '@/data/siteMetadata';
import SocialIcon from '@/components/social-icons';
import Link from '@/components/Link';
import { useRouter } from 'next/router';

const changelogLabel = { 'zh-TW': '網站大事紀', en: 'Site history', ja: 'サイトの歩み' };

export default function Footer() {
  const { locale } = useRouter();
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
          <SocialIcon kind="github" href={siteMetadata.github} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} />
          <SocialIcon kind="rss" href={siteMetadata.rss[locale]} />
        </div>
        <Link
          href="/changelog"
          className="text-sm text-gray-500 hover:text-primary-600 hover:underline dark:text-gray-400 dark:hover:text-primary-300"
        >
          {changelogLabel[locale] || changelogLabel['zh-TW']}
        </Link>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{siteMetadata.author}</div>
        </div>
      </div>
    </footer>
  );
}
