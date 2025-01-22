const OcrService = require('../service/OcrService');
const DocumentService = require('../service/DocumentService');
const { modelMap } = require('../service/DocumentService');
const File = require('../model/File');

async function saveDocData(req,res) {
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
        const mapDocument = new Model(rawDocument);
        await mapDocument.save();
        const docTypeName = DocumentService.getDocTypeById(mapDocument.docType);
        const docId = mapDocument._id.toString();
        File.findOne(mapDocument.fileRef)
        .then(async (file) => {
            if (file) {
                await OcrService.startML(docTypeName, docId, file.filename);
            }
        })
        .catch(console.error);

        return res.json({
            success: true,
            message: 'Dokumen berhasil disimpan.',
            data: mapDocument
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

module.exports = { saveDocData, updateDocData };