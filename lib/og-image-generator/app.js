const puppeteer = require('puppeteer');
const express = require('express');
const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');

const app = express();
const PORT = process.env.PORT || 3060;
const ROOT_PATH = path.join(__dirname, '../../');

const getPath = (name) => path.join(ROOT_PATH, name);

// check argv
// pnpm run og-image "life" "2023-2024"
// pnpm run og-image "software-development" "talk-about-js-eval" "en"
const folder = process.argv[2];
const postName = process.argv[3];
const lang = process.argv[4] || 'zh-TW';

if (!folder || !postName) {
  console.error(
    'Please input folder and postName, example: npm run og-image -- "life" "xss-article"'
  );
  process.exit(1);
}

// get post
const postPath = getPath(`data/${folder}/${postName}/${lang}.md`);

let postMeta;
try {
  const postContent = fs.readFileSync(postPath, 'utf8');
  postMeta = frontMatter(postContent);
} catch (err) {
  console.error('Read post file failed:', err);
  process.exit(2);
}

const template = fs
  .readFileSync(getPath('lib/og-image-generator/resources/template.html'), 'utf8')
  .replace(/{{title}}/g, escape(postMeta.attributes.title))
  .replace(/{{publishedDate}}/g, postMeta.attributes.date);

function startServer() {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log(`Starting generate image...`);
      resolve();
    });

    app.get('/', (req, res) => {
      res.send(template);
    });

    app.use(express.static(path.join(__dirname, 'resources')));
  });
}

function escape(str) {
  if (!str) return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function main() {
  await startServer();
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2,
  });

  // create folder if not exist
  const postImgDir = getPath(`public/${folder}/${postName}`);

  if (!fs.existsSync(postImgDir)) {
    fs.mkdirSync(postImgDir, { recursive: true });
    console.log('Create folder');
  }

  const cover = {
    'zh-TW': 'cover-zh-TW',
    en: 'cover-en',
    ja: 'cover-ja',
  };

  const screenshotPath = path.join(postImgDir, cover[lang]);
  await takeScreenshot(page, screenshotPath);

  await browser.close();
  console.log('Done, you can find image at: ' + screenshotPath + '.png');
  process.exit(0);
}

async function takeScreenshot(page, name) {
  await page.goto(`http://localhost:${PORT}`);
  const element = await page.$('.window');
  await element.screenshot({ path: `${name}.png` });
}

main();
