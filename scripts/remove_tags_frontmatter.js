const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dataDir = path.join(root, 'data');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(dataDir);
let modifiedCount = 0;

allFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const newLines = [];
  let inFrontMatter = false;
  let frontMatterCount = 0;
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '---') {
      frontMatterCount++;
      if (frontMatterCount <= 2) {
        inFrontMatter = !inFrontMatter; // Toggle
      }
    }

    // specific check: if inside first frontmatter block (count is 1 or just became 1)
    if (frontMatterCount === 1 || (frontMatterCount === 2 && line.trim() === '---')) {
      if (line.trim().startsWith('tags:')) {
        modified = true;
        continue; // Skip this line
      }
    }

    newLines.push(line);
  }

  if (modified) {
    fs.writeFileSync(file, newLines.join('\n'), 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Total files modified: ${modifiedCount}`);
