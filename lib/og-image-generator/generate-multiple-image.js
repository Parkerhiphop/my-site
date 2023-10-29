const { exec } = require('child_process');

// From `(posts.map((post) => post.slug));` of List Layout
const blogs = [];

const locale = ''; // default is 'zh-TW'

function runCommand(blog) {
  return new Promise((resolve, reject) => {
    exec(`npm run og-image -- ${blog} ${locale}`, (error, stdout) => {
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

async function main() {
  for (let i = 0; i < blogs.length; i++) {
    console.log(`Generate ${blogs[i]} image...`);
    await runCommand(blogs[i]);
  }
}

main();
