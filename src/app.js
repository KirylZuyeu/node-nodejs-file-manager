import { fileURLToPath } from 'url';
import {dirname, join} from 'path'
import process from 'process'
import readline from 'readline'
import os from 'os'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathForSrcFile = join(__dirname, 'files', 'fileToRead.txt');
const userName = process.argv.slice(2)[0].replace('--username=', '');

let homeDirectoryName = os.homedir();
let backSlash = homeDirectoryName.includes('/') ? '/' : '\\'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const currentDirectory = () => {
    if (homeDirectoryName.length < 3) {
        homeDirectoryName = homeDirectoryName + backSlash;
    }
    console.log(`You are currently in ${homeDirectoryName}${os.EOL}`);
}

const greating = () => {
    console.log(`Welcome to the File Manager, ${userName}!`);
    currentDirectory();
}

greating();

const upFunction = () => {
    if (homeDirectoryName.length > 3) {
        if (homeDirectoryName.includes('\\')) {
            homeDirectoryName = homeDirectoryName.substring(0, homeDirectoryName.lastIndexOf('\\'))
        } else {
            homeDirectoryName = homeDirectoryName.substring(0, homeDirectoryName.lastIndexOf('/'))
        }
    }
}

//Если Ctrl + C выходит из консоли
rl.on('SIGINT', () => close());

rl.on('line', (input) => {
    switch(input){
        case 'up':
            upFunction();
            currentDirectory()
            break;
        case 'exit':
            console.log('нажат exit')
            currentDirectory()
            break;
        case 'cat':
            console.log('нажат cat')
            currentDirectory();
            break;
        default:
            console.log('Invalid input')
    }
});

const close = () => {
    rl.write(`Thank you for using File Manager, ${userName}!`);
    rl.close();
};
  
  