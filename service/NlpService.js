require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

class NlpService {
    constructor() {
        this.NLP_HOST = process.env.NLP_HOST;
        this.DOC_DIR = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');
    }

    startTranslating(userId, filename) {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(`${this.DOC_DIR}/${filename}`));
        formData.append('requester_id', `${userId}`);
        
        console.log(`Dokumen ${filename} sedang di proses NLP`);
        Promise.resolve(
            axios({
                method: 'POST',
                url: `${this.NLP_HOST}/translate_pdf`,
                data: formData,
                headers: {
                    "content-type": "multipart/form-data"
                }
            }).catch(err => console.error('Terjadi kesalahan dalam melakukan permintaan NLP dokumen.'))
        ).catch(err => console.error(`Proses NLP dokumen ${filename} gagal: `, err.message))
    }

    async downloadTranslatedDocument(reqId, res) {
        try {
            const response = await axios.get(`${this.NLP_HOST}/translate_pdf/${reqId}`, {
                responseType: "stream"
            });

            res.setHeader("Content-Disposition", `attachment; filename="translated_document.pdf"`);
            res.setHeader("Content-Type", response.headers["content-type"]);

            response.data.pipe(res);
        } catch(err) {
            console.error("Gagal mengunduh file: ", err);
        }
    }

    async translationStatus(reqId, res) {
        axios.get(`${this.NLP_HOST}/translate_pdf/status/${reqId}`)
        .then((response) => {
            res.json(response.data);
        })
        .catch((err) => {
            res.json({
                success: false,
                message: err
            });
        })
    }
}

module.exports = new NlpService();