require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const mlhost = process.env.OCR_HOST

async function startML(docType, docId, filename) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(`./uploads/${filename}`));
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
        console.log(`[${Date.now()}] ${filename} sedang diproses`);
    } catch (err) {
        console.log(err);
    }
}

module.exports = startML;