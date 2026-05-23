import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TRANSLATED_LOCALES = ['en', 'ja'];
const CONTENT_FILE_PATTERN = /^data\/.+\/(zh-TW|en|ja)\.mdx?$/;

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function stagedContentFiles() {
  return git(['diff', '--cached', '--name-only', '--diff-filter=ACMR']).filter((file) =>
    CONTENT_FILE_PATTERN.test(file)
  );
}

function allTranslatedMarkdownFiles() {
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      const relativePath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
      if (/^data\/.+\/(en|ja)\.mdx?$/.test(relativePath)) {
        files.push(relativePath);
      }
    }
  }

  walk(path.join(ROOT, 'data'));
  return files;
}

function hasReviewByMe(file) {
  const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return Boolean(match?.[1].match(/^review-by-me:\s*(true|false)\s*$/m));
}

const stagedFiles = stagedContentFiles();
const stagedFileSet = new Set(stagedFiles);
const zhTwFiles = stagedFiles.filter((file) => /\/zh-TW\.mdx?$/.test(file));
const missingTranslations = [];

for (const zhTwFile of zhTwFiles) {
  for (const locale of TRANSLATED_LOCALES) {
    const translatedFile = zhTwFile.replace(/\/zh-TW\.mdx?$/, `/${locale}.md`);
    const translatedMdxFile = zhTwFile.replace(/\/zh-TW\.mdx?$/, `/${locale}.mdx`);

    if (!stagedFileSet.has(translatedFile) && !stagedFileSet.has(translatedMdxFile)) {
      missingTranslations.push({ source: zhTwFile, locale });
    }
  }
}

const translatedFilesMissingReviewFlag = allTranslatedMarkdownFiles().filter(
  (file) => !hasReviewByMe(file)
);

if (missingTranslations.length || translatedFilesMissingReviewFlag.length) {
  console.error('\nTranslation check failed.\n');

  if (missingTranslations.length) {
    console.error('zh-TW files were staged without matching en/ja updates:');
    for (const { source, locale } of missingTranslations) {
      console.error(`- ${source} -> missing staged ${locale} update`);
    }
    console.error('');
  }

  if (translatedFilesMissingReviewFlag.length) {
    console.error('Translated markdown files missing frontmatter `review-by-me`:');
    for (const file of translatedFilesMissingReviewFlag) {
      console.error(`- ${file}`);
    }
    console.error('');
  }

  process.exit(1);
}

console.log('Translation check passed.');
