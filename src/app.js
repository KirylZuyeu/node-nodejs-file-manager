import {join} from 'path'
import process from 'process'
import readline from 'readline'
import os from 'os'
import fs from "fs"
import { createReadStream, createWriteStream } from "fs"
import { access, readdir, rename as renameFile, cp, unlink, readFile, writeFile} from "fs/promises";
import { createHash } from 'crypto';
import { createGzip, createGunzip } from 'zlib';

const userName = process.argv.slice(2)[0].replace('--username=', '');

function renameProperty(obj, fromKey, toKey) {
    obj[toKey] = obj[fromKey];
    delete obj[fromKey];
}

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

const exists = async (path) => {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

const cdFunction = async (path) => {
    let checkingPath = join(homeDirectoryName, path);
    try {
        await access(checkingPath);
        homeDirectoryName = checkingPath
    } catch (error) {
        console.log('Operation failed - the folder name is not contained in the current directory.')
    }
    currentDirectory();
}

const lsFunction = async (path, otherParams) => {
    try {
        if (!otherParams) {
            const folderElements = await readdir(path, { withFileTypes: true });
            for (const folderElement of folderElements) {
                console.log(folderElement.name)
            }
        } else {
            throw error;
        }
    } catch (error) {
        console.log(`Operation failed - This command working without params`);
    }
    currentDirectory();
}

const catFunction = async (fileName) => {
    let checkingPath = join(homeDirectoryName, fileName);
    try {
        const readableData = await readFile(checkingPath, "utf8");
        console.log(readableData);
    } catch (error) {
        console.log('Operation failed');
    }
    currentDirectory();
}

const createNewFile = async (name) => {
    let pathToNewFile = join(homeDirectoryName, name);
    try {
        await writeFile(pathToNewFile, '', { flag: 'wx' });
        console.log(`File is created`);
    } catch (error) {
        console.log('Operation failed');
    }
    currentDirectory();
}

const renameFunction = async (nameSrc, nameDest) => {
    let pathToSrcFile = join(homeDirectoryName, nameSrc);
    let pathToDestFile = join(homeDirectoryName, nameDest);
    try {
        await renameFile(pathToSrcFile, pathToDestFile);
        console.log(`Renaming is over`);
    } catch (error) {
        console.error('Operation failed');
    }
    currentDirectory();
}

const copyFunction = async (nameSrcFile, nameDestFolder) => {
    let pathToSrcCpFile = join(homeDirectoryName, nameSrcFile);
    let pathToDestCpFile = join(homeDirectoryName, nameDestFolder, nameSrcFile);
    try {
        await cp(pathToSrcCpFile, pathToDestCpFile, { recursive: true });
        console.log(`Copering is over`);
    } catch (error) {
        console.error('Operation failed');
    }
    currentDirectory();
}

const moveFunction = async (nameSrcFile, nameDestFolder) => {
    let pathToSrcMvFile = join(homeDirectoryName, nameSrcFile);
    let pathToDestMvFolder = join(homeDirectoryName, nameDestFolder, nameSrcFile);
    try {
        await renameFile(pathToSrcMvFile, pathToDestMvFolder);
        console.log(`Moving is over`);
    } catch (error) {
        console.error('Operation failed');
    }
    currentDirectory();
}

const deleteFunction = async (nameSrcFile) => {
    let pathToSrcMvFile = join(homeDirectoryName, nameSrcFile);
    try {
        await unlink(pathToSrcMvFile);
        console.log(`Deleting is over`);
    } catch (error) {
        console.error('Operation failed');
    }
    currentDirectory();
};

const osFunction = (flag) => {
    switch (flag) {
        case'--EOL':
            console.log(JSON.stringify(os.EOL));
            break;
        case'--homedir':
            console.log(os.homedir());
            break;
        case'--username':
            console.log(os.userInfo().username); 
            break;
        case'--architecture':
            console.log(os.arch());
            break;
        default:
            console.log('Invalid flag, choose the correct one.');
            break;
    }
    currentDirectory();
};

const hashFunction = async (nameSrcFile) => {
    let pathToSrcHashFile = join(homeDirectoryName, nameSrcFile);
    try {
        const fileBuffer = await readFile(pathToSrcHashFile, { encoding: 'utf8' });
        const hashSum = createHash('sha256');
        hashSum.update(fileBuffer);
        const hex = hashSum.digest('hex');
        console.log(hex);
        currentDirectory();
    }
    catch (error) {
        console.log(`Operation failed - choose the correct name of the file`);
    }
};

const compressFunction = async (nameOfSrcFile, nameOfDestFile) => {
    let pathOfSrcCompFile = join(homeDirectoryName, nameOfSrcFile);
    let pathOfDestCompFile = join(homeDirectoryName, nameOfDestFile);
    const zip = createGzip();
    const redable = createReadStream(pathOfSrcCompFile);
    const writeble = createWriteStream(pathOfDestCompFile);
    redable.pipe(zip).pipe(writeble);
    currentDirectory();
};

const decompressFunction = async (nameOfSrcFile, nameOfDestFile) => {
    let pathOfSrcDecompFile = join(homeDirectoryName, nameOfSrcFile);
    let pathOfDestDecompFile = join(homeDirectoryName, nameOfDestFile);
    const unzip = createGunzip();
    const redable = createReadStream(pathOfSrcDecompFile);
    const writeble = createWriteStream(pathOfDestDecompFile);
    redable.pipe(unzip).pipe(writeble)
    currentDirectory();
};

const close = () => {
    rl.write(`Thank you for using File Manager, ${userName}!`);
    rl.close();
};

rl.on('SIGINT', () => close());

rl.on('line', (input) => {
    switch(true){
        case /^up/.test(input):
            if (input.split(' ').length > 1) {
                console.log(`Operation failed - This command working without params`);
            }
            homeDirectoryName = upFunction(homeDirectoryName);
            currentDirectory();
            break;
        case /^cd+/.test(input):
            let pathFromCdCommand = input.split(' ')[1];
            cdFunction(pathFromCdCommand);
            break;
        case /^ls/.test(input):
            let otherParam = input.split(' ')[1];
            lsFunction(homeDirectoryName, otherParam);
            break;
        case /^cat+/.test(input):
            let pathFromReadableFile = input.split(' ')[1];
            catFunction(pathFromReadableFile);
            break;
        case /^add+/.test(input):
            let nameOfFile = input.split(' ')[1];
            createNewFile(nameOfFile);
            break;
        case /^rn+/.test(input):
            let nameOfSrcRnFile = input.split(' ')[1];
            let nameOfDestRnFile = input.split(' ')[2];
            renameFunction(nameOfSrcRnFile, nameOfDestRnFile);
            break;
        case /^cp+/.test(input):
            let nameOfSrcCpFile = input.split(' ')[1];
            let nameOfDestCpFolder = input.split(' ')[2];
            copyFunction(nameOfSrcCpFile, nameOfDestCpFolder);
            break;
        case /^mv+/.test(input):
            let nameOfSrcMvFile = input.split(' ')[1];
            let nameOfDestMvFolder = input.split(' ')[2];
            moveFunction(nameOfSrcMvFile, nameOfDestMvFolder);
            break;
        case /^rm+/.test(input):
            let nameOfSrcRmFile = input.split(' ')[1];
            deleteFunction(nameOfSrcRmFile);
            break;
        case /^os+/.test(input):
            let osFlag = input.split(' ')[1];
            osFunction(osFlag)
            break;
        case /^hash+/.test(input):
            let nameOfTheFile = input.split(' ')[1];
            hashFunction(nameOfTheFile);
            break;
        case /^compress+/.test(input):
            let nameOfSrcCompFile = input.split(' ')[1];
            let nameOfDestCompFile = input.split(' ')[2];
            compressFunction(nameOfSrcCompFile, nameOfDestCompFile);
            break;
        case /^decompress+/.test(input):
            let nameOfSrcDecompFile = input.split(' ')[1];
            let nameOfDestDecompFile = input.split(' ')[2];
            decompressFunction(nameOfSrcDecompFile, nameOfDestDecompFile);
            break;
        case /^.exit/.test(input):
            close();
            break;
        default:
            console.log('Invalid input')
            currentDirectory();
            break;
    }
});


  
  