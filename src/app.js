import { fileURLToPath } from 'url';
import {dirname, join} from 'path'
import process from 'process'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathForSrcFile = join(__dirname, 'files', 'fileToRead.txt');

const userName = process.argv.slice(2)[0].replace('--username=', '');
console.log(`Welcome to the File Manager, ${userName}!`);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// rl.write(
//   `Привет! Вы можете ввести свое сообщение:\n(Чтобы выйти нажмите: "CTRL+C" или напишите: "exit"):\n`
// );

//Если Ctrl + C выходит из консоли
rl.on('SIGINT', () => close());

rl.on('line', (input) => {
    switch(input){
        case 'exit':
            console.log('нажат exit')
            break;
        case 'cat':
            console.log('нажат cat')
            break;
        default:
            console.log('вы ввели некоректную комманду')
    }
//   input === 'exit' ? close() : writeble.write(`${input} \n`);
});

const close = () => {
    rl.write(`Thank you for using File Manager, ${userName}!`);
    // writeble.end();
    rl.close();
  };
  
  