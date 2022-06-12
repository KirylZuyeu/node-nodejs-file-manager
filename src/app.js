import {join} from 'path'
import process from 'process'
import readline from 'readline'
import os from 'os'
import fs from "fs"
import { createReadStream, createWriteStream } from "fs"
import { access, readdir, rename as renameFile, cp, unlink, readFile} from "fs/promises";
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

const copyFunction = async (nameSrcFile, nameDestFolder) => {
    let pathToSrcCpFile = join(homeDirectoryName, nameSrcFile);
    let pathToDestCpFile = join(homeDirectoryName, nameDestFolder, nameSrcFile);
    await cp(pathToSrcCpFile, pathToDestCpFile, { recursive: true });
    currentDirectory();
}

const moveFunction = async (nameSrcFile, nameDestFolder) => {
    let pathToSrcMvFile = join(homeDirectoryName, nameSrcFile);
    let pathToDestMvFolder = join(homeDirectoryName, nameDestFolder, nameSrcFile);
    try {
        if (!(await exists(pathToSrcMvFile))) {
            throw new Error("FS operation failed");
        } else {
            await renameFile(pathToSrcMvFile, pathToDestMvFolder);
            currentDirectory();
        }
    } catch (error) {
        console.error(error.message);
    }
}

const deleteFunction = async (nameSrcFile) => {
    let pathToSrcMvFile = join(homeDirectoryName, nameSrcFile);
    try {
        if (!(await exists(pathToSrcMvFile))) {
            throw new Error("FS operation failed");
        } else {
            await unlink(pathToSrcMvFile);
            currentDirectory();
        }
    } catch (error) {
        console.error(error.message);
    }
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
            console.log('введенный вами флаг некорректен или не поддерживается');
            break;
    }
    currentDirectory();
};

const hashFunction = async (nameSrcFile) => {
    let pathToSrcHashFile = join(homeDirectoryName, nameSrcFile);
    const fileBuffer = await readFile(pathToSrcHashFile, { encoding: 'utf8' });
    const hashSum = createHash('sha256');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');
    console.log(hex);
    currentDirectory();
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
        case /^rn+/.test(input):
            let nameOfSrcRnFile = input.split(' ')[1];
            let nameOfDestRnFile = input.split(' ')[2];
            renameFunction(nameOfSrcRnFile, nameOfDestRnFile);
            break;
        case /cp+/.test(input):
            let nameOfSrcCpFile = input.split(' ')[1];
            let nameOfDestCpFolder = input.split(' ')[2];
            copyFunction(nameOfSrcCpFile, nameOfDestCpFolder);
            break;
        case /mv+/.test(input):
            let nameOfSrcMvFile = input.split(' ')[1];
            let nameOfDestMvFolder = input.split(' ')[2];
            moveFunction(nameOfSrcMvFile, nameOfDestMvFolder);
            break;
        case /rm+/.test(input):
            let nameOfSrcRmFile = input.split(' ')[1];
            deleteFunction(nameOfSrcRmFile);
            break;
        case /os+/.test(input):
            let osFlag = input.split(' ')[1];
            osFunction(osFlag)
            break;
        case /hash+/.test(input):
            let nameOfTheFile = input.split(' ')[1];
            hashFunction(nameOfTheFile);
            break;
        case /compress+/.test(input):
            let nameOfSrcCompFile = input.split(' ')[1];
            let nameOfDestCompFile = input.split(' ')[2];
            compressFunction(nameOfSrcCompFile, nameOfDestCompFile);
            break;
        case /decompress+/.test(input):
            let nameOfSrcDecompFile = input.split(' ')[1];
            let nameOfDestDecompFile = input.split(' ')[2];
            decompressFunction(nameOfSrcDecompFile, nameOfDestDecompFile);
            break;
        case /exit/.test(input):
            close();
            break;
        default:
            console.log('Invalid input')
            break;
    }
});


  
  