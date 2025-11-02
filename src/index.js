import readline from 'readline';
import os from 'os'

const userName = process.argv.slice(2)[0].replace('--username=', '');
let homeDirectoryName = os.homedir();
let backSlash = homeDirectoryName.includes('/') ? '/' : '\\'

const welcome = () => {
    console.log(`Welcome to the File Manager, ${userName}!`);
    currentDirectory();
}

const goodbye = () => {
  console.log(`Thank you for using File Manager, ${userName}!`);
}

const currentDirectory = () => {
  const path = homeDirectoryName.length < 3 ? `${homeDirectoryName}${backSlash}` : homeDirectoryName;
  console.log(`You are currently in ${path}`);
}

welcome()

const rl = readline.createInterface({
    input: process.stdin,
});

rl.on('line', async (input) => {
    const command = input.trim().split(' ')[0];

    switch (command) {
      case '.exit': {
        goodbye();
        rl.close();
        process.exit(0);
      }
      default: {
        console.log('\nInvalid input');
        currentDirectory();
      }
    }
  });

  process.on('SIGINT', () => {
    goodbye();
    rl.close()
  });
