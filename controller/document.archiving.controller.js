require('dotenv').config();
const File = require('../model/File');
const { BaseModel } = require('../model/Document');

async function deleteDocFile(req,res) {
    const { docId, filename } = req.body;
    const doc = await BaseModel.findById(docId);
    const file = await File.findOne({ filename: filename});
    const fs = require('fs');
    if (process.env.NODE_ENV === 'development') {
        fs.readdir('uploads/', { withFileTypes: true, recursive: true }, (err,files) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Content in uploads');
                for (let fileId in files) {
                    console.log(`[${fileId}]: `+files[fileId]);
                }
            }
        });
    }
    if (doc && file) {
        fs.unlink(file.path, async err => {
            if (err) {
                console.log('Error deleting file. Error: ' + err);
            } else {
                await File.deleteOne({ filename: filename });
                await BaseModel.deleteOne({ docName: doc.docName });
                console.log('File deleted successfully');
            }
        }) 

        return res.json({
            success: true,
            message: 'Dokumen berhasil dihapus',
        })
    } else if (doc) {
        return res.json({
            success: false,
            message: 'File tidak ditemukan',
            data: {
                doc: doc
            }
        })
    } else if (file) {
        return res.json({
            success: false,
            message: 'Dokumen tidak ditemukan',
            data: {
                file: file
            }
        })
    }

    return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan. Apakah docId dan filename sudah benar?.'
    });
}

module.exports = { deleteDocFile };