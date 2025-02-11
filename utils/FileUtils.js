require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { fromPath } = require('pdf2pic');
const thumbnailDir = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');

class FileUtils {
    static async convertPdfToImage(filename, pdfPath, page) {
        try {
            const options = {
                density: 100,
                saveFilename: filename,
                savePath: `${thumbnailDir}/thumbnails`,
                format: "png",
                width: 600,
                height: 600
            }

            const convert = fromPath(pdfPath, options);
            const result = await convert(page, { responseType: 'image' });
            return result.path;
        } catch(err) {
            console.log(err);
        }
    }

    static async deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}

module.exports = FileUtils;