require('dotenv').config();
const fs = require('fs');
const path = require('path');

const uploadsFolder = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');

/** Working As Intended */
class FolderUtils {
    static ensureUploadsFolderExists() {
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder, {recursive: true});
            console.log(`Folder '${uploadsFolder}' berhasil dibuat.`);
        }
    }
}

module.exports = FolderUtils;