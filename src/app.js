import { fileURLToPath } from 'url';
import {dirname, join} from 'path'
import process from 'process'
import readline from 'readline'
import os from 'os'
import fs from "fs"
import { createReadStream } from "fs"
import { access, readdir, rename as renameFile, cp} from "fs/promises";

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
        console.log(`You are currently in ${homeDirectoryName}${backSlash}${os.EOL}`);
    } else {
        console.log(`You are currently in ${homeDirectoryName}${os.EOL}`);
    }
    
}

const greating = () => {
    console.log(`Welcome to the File Manager, ${userName}!`);
    currentDirectory();
}

greating();

const upFunction = (homeDirectorypath) => {
    if (homeDirectorypath.length > 3) {
        if (homeDirectorypath.includes('\\')) {
            return homeDirectorypath.substring(0, homeDirectorypath.lastIndexOf('\\'))
        } else {
            return homeDirectorypath.substring(0, homeDirectorypath.lastIndexOf('/'))
        }
    } else {
        return homeDirectorypath;
    }
}

const changeBackSlash = (path) => {
    let backSlashInPath = path.match(/\/$/) ? '/' : '\\'
    if (backSlash !== backSlashInPath) {
        return path.replace(backSlashInPath, backSlash);
    } else {
        return path;
    }
}

const exists = async (path) => {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

const cdFunction = async (path) => {
    let convertedPath = changeBackSlash(path);
    let checkingPath = join(homeDirectoryName, convertedPath);
    if(await exists(checkingPath)) {
        homeDirectoryName = checkingPath
    } else {
        console.log('Папка не существует')
    }
    currentDirectory();
}

const lsFunction = async (path) => {
    const folderElements = await readdir(path, { withFileTypes: true });
    for (const folderElement of folderElements) {
        console.log(folderElement.name)
    }
    currentDirectory();
}

const catFunction = async (path) => {
    let convertedPath = changeBackSlash(path);
    let checkingPath = join(homeDirectoryName, convertedPath);
    if(await exists(checkingPath)) {
        const readableStream = createReadStream(checkingPath, 'utf8');
        readableStream.on('data', chunk => {
            const textData = Buffer.from(chunk).toString();
            process.stdout.write(textData + '\n');
            currentDirectory();
        });
    } else {
        console.log('файл не существует')
    }
}

const createNewFile = (name) => {
    let pathToNewFile = join(homeDirectoryName, name);
    fs.open(pathToNewFile, "w", function (err, fd) {
        fs.close(fd, function (err) {
        });
    });
    currentDirectory();
}

const renameFunction = async (nameSrc, nameDest) => {
    let pathToSrcFile = join(homeDirectoryName, nameSrc);
    let pathToDestFile = join(homeDirectoryName, nameDest);
    try {
        if (!(await exists(pathToSrcFile)) || (await exists(pathToDestFile))) {
            throw new Error("FS operation failed");
        } else {
            await renameFile(pathToSrcFile, pathToDestFile);
            currentDirectory();
        }
    } catch (error) {
        console.error(error.message);
    }
}

const copyFunction = async (nameSrc, nameDest) => {
    let pathToSrcCpFile = join(homeDirectoryName, nameSrc);
    let pathToDestCpFile = join(homeDirectoryName, nameDest, nameSrc);
    await cp(pathToSrcCpFile, pathToDestCpFile, { recursive: true });
    currentDirectory();
}

rl.on('SIGINT', () => close());

rl.on('line', (input) => {
    switch(true){
        case /up/.test(input):
            homeDirectoryName = upFunction(homeDirectoryName);
            currentDirectory();
            break;
        case /cd+/.test(input):
            let pathFromCdCommand = input.split(' ')[1];
            cdFunction(pathFromCdCommand);
            break;
        case /ls/.test(input):
            lsFunction(homeDirectoryName);
            break;
        case /cat+/.test(input):
            let pathFromReadableFile = input.split(' ')[1];
            catFunction(pathFromReadableFile);
            break;
        case /add+/.test(input):
            let nameOfFile = input.split(' ')[1];
            createNewFile(nameOfFile);
            break;
        case /rn+/.test(input):
            let nameOfSrcRnFile = input.split(' ')[1];
            let nameOfDestRnFile = input.split(' ')[2];
            renameFunction(nameOfSrcRnFile, nameOfDestRnFile);
            break;
        case /cp+/.test(input):
            let nameOfSrcCpFile = input.split(' ')[1];
            let nameOfDestCpFile = input.split(' ')[2];
            copyFunction(nameOfSrcCpFile, nameOfDestCpFile);
            break;
        case /exit/.test(input):
            console.log('нажат exit')
            break;
        default:
            console.log('Invalid input')
            break;
    }
    // switch(input){
    //     case 'up':
    //         homeDirectoryName = upFunction(homeDirectoryName);
    //         currentDirectory();
    //         break;
    //     case (input.includes('cd')):
    //         console.log(input.includes('cd'))
    //         // let pathFromCdCommand = include.split(' ')[1];
    //         // cdFunction(pathFromCdCommand);
    //         // currentDirectory();
    //         break;
    //     case 'exit':
    //         console.log('нажат exit')
    //         currentDirectory()
    //         break;
    //     default:
    //         console.log('Invalid input')
    //         break;
    // }
});

const close = () => {
    rl.write(`Thank you for using File Manager, ${userName}!`);
    rl.close();
};
  
  