const OcrService = require('../service/OcrService');
const NlpService = require('../service/NlpService')
const DocumentService = require('../service/DocumentService');
const { modelMap } = require('../service/DocumentService');
const File = require('../model/File');
const { BaseModel } = require('../model/Document');

async function saveDocData(req,res) {
    const { ocr } = req.query;
    const { docType } = req.params;
    const rawDocument = req.body;
    const Model = modelMap[docType];
    if (!Model) {
        return res.status(400).json({
            success: false,
            message: 'Tipe dokumen tidak ditemukan.'
        })
    }

    try {
        let docData = new Model(rawDocument);
        docData = await docData.save();

        // if (ocr) {
        //     File.findOne(docData.fileRef[0]._id)
        //     .then(async (file) => {
        //         if (file) {
        //             const docTypeName = DocumentService.getDocTypeById(file.documentType);
        //             const docId = docData._id.toString();
        //             const filename = file.filename;
        //             OcrService.startML(docTypeName, docId, filename);
        //         }
        //     })
        //     .catch(console.error);
        // }

        return res.json({
            success: true,
            message: 'Dokumen berhasil disimpan.',
            data: docData,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Gagal menyimpan dokumen. Error: ' + err.message
        })
    }
}

async function updateDocData(req,res) {
    const { docType, docId } = req.params;
    const updateData = req.body;
    const Model = modelMap[docType];

    if (!Model) {
        return res.status(400).json({
            success: false,
            message: 'docType tidak ada kecocokan di database.'
        });
    }

    try {
        const existingDocument = await Model.findById(docId);
        if (!existingDocument) {
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan.'
            })
        }

        Object.assign(existingDocument, updateData);
        await existingDocument.save();

        return res.json({
            success: true,
            message: 'Dokumen berhasil diperbarui.',
            data: existingDocument
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui dokumen. Error: ' + err.message
        })
    }
}

async function translateDocFile(req,res) {
    const { userId, filename } = req.body;
    if (userId && filename) {
        File.findOne({filename})
        .then(file => {
            if (file) {
                NlpService.startTranslating(userId, filename);
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'File Dokumen PDF tidak ditemukan.'
                });
            }

            return res.json({
                success: true,
                message: 'Permintaan translasi dokumen sedang diproses.'
            })
        })
        .catch(console.error);
    } else {
        return res.status(400).json({
            success: false,
            message: 'Permintaan tidak lengkap. Apakah userId dan filename sudah benar diisikan?'
        })
    }
}

async function getTranslatedDocFile(req,res) {
    const { reqId } = req.params;
    if (reqId) {
        await NlpService.downloadTranslatedDocument(reqId, res);
    } else {
        return res.status(400).json({
            success: false,
            message: 'Parameter req_id diperlukan'
        });
    }
}

async function getTranslationStatus(req,res) {
    const { reqId } = req.params;
    if (reqId) {
        await NlpService.translationStatus(reqId, res);
    } else {
        return res.status(400).json({
            success: false,
            message: 'Parameter req_id diperlukan'
        });
    }
}

module.exports = { saveDocData, updateDocData, translateDocFile, getTranslationStatus, getTranslatedDocFile };