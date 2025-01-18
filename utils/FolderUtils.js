require('dotenv').config();
const fs = require('fs');
const path = require('path');

const uploadsDir = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');
const thumbnailDir = path.join(uploadsDir, 'thumbnails');

/** Working As Intended */
class FolderUtils {
    static ensureUploadsFolderExists() {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, {recursive: true});
            console.log(`Folder '${uploadsDir}' berhasil dibuat.`);
        }
        if (!fs.existsSync(thumbnailDir)) {
            fs.mkdirSync(thumbnailDir, {recursive: true});
            console.log(`Folder '${thumbnailDir}' berhasil dibuat.`);
        }
    }
}

module.exports = FolderUtils;