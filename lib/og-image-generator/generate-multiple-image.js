const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const folders = ['life', 'reading', 'review', 'software-development'];
const dataPath = path.join(__dirname, '../../data');
const publicPath = path.join(__dirname, '../../public');

function runCommand(folder, postName, lang = 'zh-TW') {
  return new Promise((resolve, reject) => {
    exec(`pnpm run og-image "${folder}" "${postName}" "${lang}"`, (error, stdout) => {
      if (error) {
        console.error(`Error: ${error}`);
        reject(error);
        return;
      }
      console.log(`resolved: ${stdout}`);
      resolve();
    });
  });
}

async function generateImagesForFolder(folder) {
  const folderPath = path.join(dataPath, folder);
  const posts = fs.readdirSync(folderPath);

  for (const post of posts) {
    const postPath = path.join(folderPath, post);
    if (fs.statSync(postPath).isDirectory()) {
      const languages = fs
        .readdirSync(postPath)
        .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
        .map((file) => path.parse(file).name);

      const commonCoverPath = path.join(publicPath, folder, post, 'cover.png');
      if (fs.existsSync(commonCoverPath)) {
        console.log(`Common cover image for ${folder}/${post} already exists. Skipping...`);
        continue;
      }

      for (const lang of languages) {
        const imagePath = path.join(publicPath, folder, post, `cover-${lang}.png`);
        if (!fs.existsSync(imagePath)) {
          console.log(`Generate ${folder}/${post} image for ${lang}...`);
          await runCommand(folder, post, lang);
        } else {
          console.log(`Image for ${folder}/${post} (${lang}) already exists. Skipping...`);
        }
      }
    }
  }
}

async function main() {
  for (const folder of folders) {
    await generateImagesForFolder(folder);
  }
}

main();
