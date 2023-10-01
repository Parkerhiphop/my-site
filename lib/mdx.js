import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import readingTime from 'reading-time';
import getAllFilesRecursively from './utils/files';
// Remark packages
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import remarkMath from 'remark-math';
import remarkExtractFrontmatter from './remark-extract-frontmatter';
import remarkCodeTitles from './remark-code-title';
import remarkTocHeadings from './remark-toc-headings';
import remarkImgToJsx from './remark-img-to-jsx';
// Rehype packages
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeCitation from 'rehype-citation';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypePresetMinify from 'rehype-preset-minify';

const root = process.cwd();

export function formatSlug(slug) {
  // return slug.replace(/\.(mdx|md)/, '')
  // take the main root of slug e.g. post-name in post-name.en.mdx
  return slug.split('.')[0];
}

function dateSortDesc(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

export async function getFileBySlug(type, slug, currentLocale = 'zh-TW') {
  const [mdxPath, mdPath] =
    currentLocale === 'zh-TW'
      ? [
          path.join(root, 'data', type, `${slug}/zh-TW.mdx`),
          path.join(root, 'data', type, `${slug}/zh-TW.md`),
        ]
      : [
          path.join(root, 'data', type, `${slug}/${currentLocale}.mdx`),
          path.join(root, 'data', type, `${slug}/${currentLocale}.md`),
        ];

  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8');

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'esbuild.exe');
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild');
  }

  let toc = [];

  const { code, frontmatter } = await bundleMDX({
    source,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, 'components'),
    xdmOptions(options, frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeTitles,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
        remarkImgToJsx,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      };
      return options;
    },
  });

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath)
        ? `${slug}/${currentLocale}.mdx`
        : `${slug}/${currentLocale}.md`,
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  };
}

export async function getAllFilesFrontMatter(folder, currentLocale) {
  const prefixPaths = path.join(root, 'data', folder);

  const files = getAllFilesRecursively(prefixPaths);

  const relevantFiles =
    currentLocale === ''
      ? files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      : files.filter(
          (file) => file.includes(`/${currentLocale}.md`) || file.includes(`/${currentLocale}.mdx`)
        );

  const allFrontMatter = [];

  relevantFiles.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/');
    // Remove Unexpected File
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return;
    }
    const source = fs.readFileSync(file, 'utf8');
    const { data: frontmatter } = matter(source);
    if (frontmatter.draft !== true) {
      allFrontMatter.push({
        ...frontmatter,
        slug: formatSlug(fileName.split('/')[0]), // Assuming the fileName is the first part
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
      });
    }
  });

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date));
}
