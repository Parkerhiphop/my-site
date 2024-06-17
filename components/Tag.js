import Link from 'next/link';
import kebabCase from '@/lib/utils/kebabCase';

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <span className="cursor-pointer mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
        {text.split(' ').join('-')}
      </span>
    </Link>
  );
};

export default Tag;
