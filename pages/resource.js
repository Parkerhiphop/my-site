import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { getFileBySlug } from '@/lib/mdx';

export async function getStaticProps({ locale, locales }) {
  const resource = await getFileBySlug('resource', '', locale);
  return { props: { resource, availableLocales: locales } };
}

export default function Resource({ resource, availableLocales }) {
  const { mdxSource, frontMatter } = resource;

  return (
    <MDXLayoutRenderer
      layout="ResourceLayout"
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      availableLocales={availableLocales}
    />
  );
}
