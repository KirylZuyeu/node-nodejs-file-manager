import readline from 'readline';
import os from 'os'
import path from 'path';
import { access, lstat , readdir, rename as renameFile, cp, unlink, readFile, writeFile, mkdir } from "fs/promises";
import { createReadStream, createWriteStream } from "fs"
import crypto from 'crypto';
import { createBrotliCompress , createBrotliDecompress } from 'zlib';

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

const lsFunction = async () => {
    try {
        const folderElements = await readdir(homeDirectoryName, { withFileTypes: true });

        const items = folderElements
            .filter(item => item.name !== '.' && item.name !== '..')
            .map(dirent => {
                let type;
                if (dirent.isDirectory()) {
                    type = 'directory';
                } else if (dirent.isFile()) {
                    type = 'file';
                } else {
                    type = 'other';
                }

                return {
                    Name: dirent.name,
                    Type: type,
                };
            });

        items.sort((a, b) => {
            const typeA = a.Type === 'directory' ? 0 : a.Type === 'file' ? 1 : 2;
            const typeB = b.Type === 'directory' ? 0 : b.Type === 'file' ? 1 : 2;

            if (typeA !== typeB) {
                return typeA - typeB;
            } else {
                return a.Name.localeCompare(b.Name);
            }
        });

        console.table(items);

    } catch (error) {
        console.log('Operation failed');
    } finally {
        currentDirectory();
    }
}

const catFunction = async (fileName) => {
    let checkingPath = path.join(homeDirectoryName, fileName);
    const readableStream = createReadStream(checkingPath);
    readableStream.on('data', chunk => {
        const textData = Buffer.from(chunk).toString();
        console.log(textData);
        currentDirectory();
    }).on('error', () => {
        console.log('Operation failed');
        currentDirectory();
    });
}

const createNewFile = async (name) => {
    let pathToNewFile = path.join(homeDirectoryName, name);
    const writeStream = createWriteStream(pathToNewFile);
    writeStream.on('close', () => {
      console.log(`File ${pathToNewFile} created`);
          currentDirectory();
    });

    writeStream.on('error', () => {
      console.log('\nOperation failed');
          currentDirectory();
    });

    writeStream.close();
}

const createNewDirectory = async (dirName) => {
  if (!dirName) {
    console.log('Invalid input');
    currentDirectory();
    return;
  }

  const dirPath = path.isAbsolute(dirName) ? dirName : path.join(homeDirectoryName, dirName);

  try {
    await mkdir(dirPath, { recursive: true });
    console.log(`Directory "${dirPath}" created successfully`);
  } catch (err) {
    console.log('Operation failed');
  } finally {
    currentDirectory();
  }
};

const renameFunction = async (nameSrc, nameDest) => {
    let pathToSrcFile = path.join(homeDirectoryName, nameSrc);
    let pathToDestFile = path.join(homeDirectoryName, nameDest);
    try {
        await renameFile(pathToSrcFile, pathToDestFile);
        console.log(`Renaming is over`);
    } catch (error) {
        console.error('Operation failed');
    }
    currentDirectory();
}

const copyFunction = async (nameSrcFile, nameDestFolder) => {
  try {
    const pathToSrcCpFile = path.join(homeDirectoryName, nameSrcFile);
    const pathToDestCpFile = path.join(homeDirectoryName, nameDestFolder, path.basename(nameSrcFile));

    await access(pathToSrcCpFile);
    const isFile = await checkIsFile(pathToSrcCpFile);
    if (!isFile) {
      console.log('Cannot copy a directory');
      currentDirectory();
      return;
    }

    const readableStream = createReadStream(pathToSrcCpFile);
    const writableStream = createWriteStream(pathToDestCpFile);

    readableStream.pipe(writableStream);

    writableStream.on('finish', () => {
      console.log(`File copied successfully to ${pathToDestCpFile}`);
      currentDirectory();
    });

    readableStream.on('error', () => {
      console.log('Operation failed (read error)');
      currentDirectory();
    });

    writableStream.on('error', () => {
      console.log('Operation failed (write error)');
      currentDirectory();
    });

  } catch (error) {
    console.log('Operation failed');
    currentDirectory();
  }
};

const moveFunction = async (nameSrcFile, nameDestFolder) => {
  try {
    const pathToSrcMvFile = path.join(homeDirectoryName, nameSrcFile);
    const pathToDestMvFile = path.join(homeDirectoryName, nameDestFolder, path.basename(nameSrcFile));

    await access(pathToSrcMvFile);
    const isFile = await checkIsFile(pathToSrcMvFile);
    if (!isFile) {
      console.log('Cannot move a directory');
      currentDirectory();
      return;
    }

    const readableStream = createReadStream(pathToSrcMvFile);
    const writableStream = createWriteStream(pathToDestMvFile);

    readableStream.pipe(writableStream);

    writableStream.on('finish', async () => {
      try {
        await unlink(pathToSrcMvFile);
        console.log(`File moved successfully to ${pathToDestMvFile}`);
      } catch {
        console.log('File copied but could not delete original');
      }
      currentDirectory();
    });

    readableStream.on('error', () => {
      console.log('Operation failed (read error)');
      currentDirectory();
    });

    writableStream.on('error', () => {
      console.log('Operation failed (write error)');
      currentDirectory();
    });

  } catch (error) {
    console.log('Operation failed');
    currentDirectory();
  }
};

const deleteFunction = async (fileName) => {
  try {
    if (!fileName) {
      console.log('Invalid input');
      currentDirectory();
      return;
    }

    const filePath = path.isAbsolute(fileName)
      ? fileName
      : path.join(homeDirectoryName, fileName);

    await access(filePath);

    await unlink(filePath);

    console.log(`File "${path.basename(filePath)}" deleted successfully`);
  } catch (err) {
    console.log('Operation failed');
  } finally {
    currentDirectory();
  }
};

const osFunction = (flag) => {
    switch (flag) {
        case'--EOL':
            console.log(JSON.stringify(os.EOL));
            break;
        case'--cpus':
            console.log(os.cpus().map((v) => {
                return {'model': v.model, 'speed': Number((v.speed / 1000).toFixed(2))};
            }));
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

const hashFunction = async (fileName) => {
  try {
    if (!fileName) {
      console.log('Invalid input');
      currentDirectory();
      return;
    }
    const filePath = path.isAbsolute(fileName)
      ? fileName
      : path.join(homeDirectoryName, fileName);

    const hash = crypto.createHash('sha256');
    const readStream = createReadStream(filePath);

    readStream.on('data', (chunk) => {
      hash.update(chunk);
    });

    readStream.on('end', () => {
      const fileHash = hash.digest('hex');
      console.log(fileHash);
      currentDirectory();
    });

    readStream.on('error', () => {
      console.log('Operation failed');
      currentDirectory();
    });

  } catch (err) {
    console.log('Operation failed');
    currentDirectory();
  }
};

const compressFunction = async (srcFile, destFile) => {
  try {
    if (!srcFile || !destFile) {
      console.log('Invalid input');
      currentDirectory();
      return;
    }

    const srcFilePath = path.isAbsolute(srcFile)
      ? srcFile
      : path.join(homeDirectoryName, srcFile);

    let destFilePath = path.isAbsolute(destFile)
      ? destFile
      : path.join(homeDirectoryName, destFile);

    if (!destFilePath.endsWith('.br')) {
      destFilePath += '.br';
    }

    const readStream = createReadStream(srcFilePath);
    const writeStream = createWriteStream(destFilePath);
    const brotli = createBrotliCompress();

    readStream.pipe(brotli).pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`File compressed successfully to ${destFilePath}`);
      currentDirectory();
    });

    readStream.on('error', () => {
      console.log('Operation failed (read error)');
      currentDirectory();
    });

    writeStream.on('error', () => {
      console.log('Operation failed (write error)');
      currentDirectory();
    });

  } catch (err) {
    console.log('Operation failed');
    currentDirectory();
  }
};

const decompressFunction = async (srcFile, destFile) => {
  try {
    if (!srcFile || !destFile) {
      console.log('Invalid input');
      currentDirectory();
      return;
    }

    const srcFilePath = path.isAbsolute(srcFile)
      ? srcFile
      : path.join(homeDirectoryName, srcFile);

    const destFilePath = path.isAbsolute(destFile)
      ? destFile
      : path.join(homeDirectoryName, destFile);

    const readStream = createReadStream(srcFilePath);
    const writeStream = createWriteStream(destFilePath);
    const brotli = createBrotliDecompress();

    readStream.pipe(brotli).pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`File decompressed successfully to ${destFilePath}`);
      currentDirectory();
    });

    readStream.on('error', () => {
      console.log('Operation failed (read error)');
      currentDirectory();
    });

    writeStream.on('error', () => {
      console.log('Operation failed (write error)');
      currentDirectory();
    });

  } catch (err) {
    console.log('Operation failed');
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
            lsFunction();
            break;
        }
        case 'cat': {
            let pathFromReadableFile = input.split(' ')[1];
            catFunction(pathFromReadableFile);
            break;
        }
        case 'add': {
            let nameOfFile = input.split(' ')[1];
            createNewFile(nameOfFile);
            break;
        }
        case 'mkdir': {
            let dirName = input.split(' ')[1];
            await createNewDirectory(dirName);
            break;
        }
        case 'rn': {
            let nameOfSrcRnFile = input.split(' ')[1];
            let nameOfDestRnFile = input.split(' ')[2];
            renameFunction(nameOfSrcRnFile, nameOfDestRnFile);
            break;
        }
        case 'cp': {
            let nameOfSrcCpFile = input.split(' ')[1];
            let nameOfDestCpFolder = input.split(' ')[2];
            copyFunction(nameOfSrcCpFile, nameOfDestCpFolder);
            break;
        }
        case 'mv': {
            let nameOfSrcMvFile = input.split(' ')[1];
            let nameOfDestMvFolder = input.split(' ')[2];
            moveFunction(nameOfSrcMvFile, nameOfDestMvFolder);
            break;
        }
        case 'rm': {
            let nameOfSrcRmFile = input.split(' ')[1];
            deleteFunction(nameOfSrcRmFile);
            break;
        }
        case 'os': {
            let osFlag = input.split(' ')[1];
            osFunction(osFlag)
            break;
        }
        case 'hash': {
            let nameOfTheFile = input.split(' ')[1];
            hashFunction(nameOfTheFile);
            break;
        }
        case 'compress': {
            let nameOfSrcCompFile = input.split(' ')[1];
            let nameOfDestCompFile = input.split(' ')[2];
            compressFunction(nameOfSrcCompFile, nameOfDestCompFile);
            break;
        }
        case 'decompress': {
            let nameOfSrcDecompFile = input.split(' ')[1];
            let nameOfDestDecompFile = input.split(' ')[2];
            decompressFunction(nameOfSrcDecompFile, nameOfDestDecompFile);
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
