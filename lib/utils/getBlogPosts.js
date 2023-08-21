import path from 'path';
import getAllFilesRecursively from './files';

export function getBlogPosts(type, locale = '') {
  const root = process.cwd();

  const prefixPaths = path.join(root, 'data', type);

  return getAllFilesRecursively(prefixPaths)
    .filter(
      (file) =>
        file.endsWith(`/${locale}.md`) ||
        file.endsWith(`/${locale}.mdx`) ||
        (locale === '' && !file.includes('/'))
    )
    .map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'));
}
