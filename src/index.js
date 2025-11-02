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

const upFunction = (homeDirectorypath, otherParams) => {
    try {
        if (!otherParams) {
            if (homeDirectorypath.length > 3) {
                return homeDirectorypath.substring(0, homeDirectorypath.lastIndexOf(backSlash))
            } else {
                return homeDirectorypath;
            }
        } else {
            throw error;
        }
    } catch (error) {
        console.log('Operation failed - This command working without params.')
    }
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
        case 'up': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
            break;
        }
        case 'cd': {
            let anotherParam = input.split(' ')[1];
            homeDirectoryName = upFunction(homeDirectoryName, anotherParam) || homeDirectoryName;
            currentDirectory();
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
