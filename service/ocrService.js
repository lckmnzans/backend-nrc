const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function startML(docType, docId, filename) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(`./uploads/${filename}`));
        formData.append('doc_type', `${docType}`);
        formData.append('doc_id', `${docId}`)

        const response = axios({
            method: 'POST',
            url: 'http://localhost:5000/extract',
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