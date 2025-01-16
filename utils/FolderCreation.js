require('dotenv').config();
const fs = require('fs');
const path = require('path');

const uploadsFolder = path.join(__dirname, '..', 'uploads');

/** Working As Intended */
function ensureUploadsFolderExists() {
    if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder, {recursive: true});
        console.log(`Folder 'uploads' berhasil dibuat.`);
    }
}

module.exports = async function() {
    ensureUploadsFolderExists();
}