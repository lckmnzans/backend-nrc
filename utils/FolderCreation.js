require('dotenv').config();
const fs = require('fs');
const path = require('path');

const uploadsFolder = path.join(__dirname, '..', 'uploads');

function ensureUploadsFolderExists() {
    if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder);
        console.log(`Folder 'uploads' berhasil dibuat.`);
    }
}

module.exports = async function() {
    ensureUploadsFolderExists();
}