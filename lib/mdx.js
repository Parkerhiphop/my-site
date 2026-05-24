import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
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
import rehypeKatex from 'rehype-katex';
import rehypeCitation from 'rehype-citation';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypePresetMinify from 'rehype-preset-minify';

const root = process.cwd();

export function formatSlug(slug) {
  // return slug.replace(/\.(mdx|md)/, '')
  // take the main root of slug e.g. post-name in post-name.en.mdx
  return slug.replace(/\.(mdx|md)$/, '').replace(/\/(zh-TW|en|ja)$/, '');
}

function dateSortDesc(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

function estimateWordCount(source) {
  const { content } = matter(source);
  const plainText = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_~|[\]{}()\\-]/g, ' ');

  const cjkCharacters =
    plainText.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu)?.length || 0;
  const latinWords =
    plainText
      .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu, ' ')
      .match(/[A-Za-z0-9]+(?:['’.-][A-Za-z0-9]+)*/g)?.length || 0;

  return cjkCharacters + latinWords;
}

export async function getFileBySlug(category, slug, currentLocale = 'zh-TW') {
  const normalizedSlug = Array.isArray(slug) ? slug.join('/') : slug || '';
  const fileBasePath = normalizedSlug
    ? path.join(root, 'data', category, normalizedSlug, currentLocale)
    : path.join(root, 'data', category, currentLocale);
  const mdxPath = `${fileBasePath}.mdx`;
  const mdPath = `${fileBasePath}.md`;

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
      wordCount: estimateWordCount(source),
      category: category || '',
      slug: normalizedSlug || null,
      fileName: fs.existsSync(mdxPath)
        ? [normalizedSlug, `${currentLocale}.mdx`].filter(Boolean).join('/')
        : [normalizedSlug, `${currentLocale}.md`].filter(Boolean).join('/'),
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  };
}

export async function getAllFilesFrontMatter(folder, currentLocale) {
  const prefixPaths = path.join(root, 'data', folder);

  const files = getAllFilesRecursively(prefixPaths);
  const locale = currentLocale || 'zh-TW';

  const relevantFiles = files.filter(
    (file) => file.includes(`/${locale}.md`) || file.includes(`/${locale}.mdx`)
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
      const slug = formatSlug(fileName);

      allFrontMatter.push({
        ...frontmatter,
        category: folder,
        section: slug.split('/')[0],
        slug,
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
      });
    }
  });

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date));
}
