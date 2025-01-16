require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const mlhost = process.env.OCR_HOST
const docDir = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');

/** Working As Intended */
async function startML(docType, docId, filename) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(`${docDir}/${filename}`));
        formData.append('doc_type', `${docType}`);
        formData.append('doc_id', `${docId}`)

        const response = axios({
            method: 'POST',
            url: `${mlhost}/extract`,
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

module.exports = startML;