const userName = process.argv.slice(2)[0].replace('--username=', '');

const greating = () => {
    console.log(`Welcome to the File Manager, ${userName}!`);
}

greating();
