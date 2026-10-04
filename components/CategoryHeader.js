import siteMetadata from '@/data/siteMetadata';

export default function CategoryHeader({ type, title, description }) {
  return (
    <header className="border-b border-gray-200 pb-8 dark:border-gray-800">
      <div className="grid gap-6 md:items-end">
        <div>
          <h1 className="heading-1 mt-2">
            {siteMetadata.iconMap[type]} {title}
          </h1>
          <div className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
            {description}
          </div>
        </div>
      </div>
    </header>
  );
}
