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

    async startML(docType, docId, filename) {
        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(`${this.DOC_DIR}/${filename}`));
            formData.append('doc_type', `${docType}`);
            formData.append('doc_id', `${docId}`)
    
            const response = axios({
                method: 'POST',
                url: `${this.ML_HOST}/extract`,
                data: formData,
                headers: {
                    "content-type": "multipart/form-data"
                }
            });
            console.log(`${filename} sedang diproses`);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new OcrService();