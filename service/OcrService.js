require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

/** Working As Intended */
class OcrService {
    constructor() {
        this.ML_HOST = process.env.OCR_HOST;
        this.DOC_DIR = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');
    }

    startML(docType, docId, filename) {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(`${this.DOC_DIR}/${filename}`));
        formData.append('doc_type', `${docType}`);
        formData.append('doc_id', `${docId}`)

        console.log(`Dokumen ${docId} sedang diproses OCR...`);
        Promise.resolve(
            axios({
                method: 'POST',
                url: `${this.ML_HOST}/extract`,
                data: formData,
                headers: {
                    "content-type": "multipart/form-data"
                }
            })
        ).catch(err => console.error(`Proses OCR dokumen ${docId} gagal: `, err.message));
    }
}

module.exports = new OcrService();