const PDFMerger = require('pdf-merger-js');
const merger = new PDFMerger();
const path = require('path');
const saveDir = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');

class PdfUtils {
    static async mergePDFs(defaultFilename, pdfFiles) {
        for (const pdfFile of pdfFiles) {
            await merger.add(pdfFile);
        }
    
        let mergedFileName = 'merged_'+ defaultFilename;
        const mergedFilePath = path.join(saveDir, mergedFileName);
        await merger.save(mergedFilePath);

        return mergedFileName;
    }
}

module.exports = PdfUtils;