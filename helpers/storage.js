const fs = require('fs');
const path = require('path');

const storagePath = path.resolve(__dirname, 'storage.json');
const storge = require(storagePath);


const localStorage = {
    setItem : async (item) => {
    try {
        const data = { token: item }
        const writeData = fs.createWriteStream(storagePath, 'utf8');
        await writeData.write(JSON.stringify(data));
        writeData.on('close', () => {
        return true;
        })
    } catch(e) {
        console.log(e);
    }

    },

    getItem : (item) => {
        return storge[item]
    }
}

module.exports = localStorage;