import readline from 'readline';
import os from 'os'
import path from 'path';
import { access, lstat , readdir, rename as renameFile, cp, unlink, readFile, writeFile} from "fs/promises";

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

const checkIsFile = async (targetPath) => {
  try {
    const stat = await lstat(targetPath);
    return stat.isFile();
  } catch {
    console.log('Operation failed');
    return false;
  }
};

const upFunction = () => {
    if (homeDirectoryName.length > 3) {
        homeDirectoryName = homeDirectoryName.substring(0, homeDirectoryName.lastIndexOf(backSlash))
    }
    currentDirectory();
}

const cdFunction = async (command) => {
  try {
    const params = command.trim().split('cd ')[1];

    if (!params) {
      console.log('Invalid input');
      currentDirectory();
      return;
    }

    if (params === '..') {
      upFunction();
      return
    }

    const newPath = path.isAbsolute(params) ? params : path.join(homeDirectoryName, params);

    await access(newPath);

    const isFile = await checkIsFile(newPath);
    if (!isFile) {
      homeDirectoryName = newPath;
    } else {
      console.log('Cannot cd into a file');
    }

    currentDirectory();
  } catch {
    console.log('\nInvalid path');
    currentDirectory();
  }
};

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
        case 'up': {
            upFunction();
            break;
        }
        case 'cd': {
            await cdFunction(input.trim());
            break;
        }
        case 'ls': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'cat': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'add': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'mkdir': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'rn': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'cp': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'mv': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'rm': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'os': {
            console.log('multipl choose')
            break;
        }
        case 'hash': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'compress': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'decompress': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
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
