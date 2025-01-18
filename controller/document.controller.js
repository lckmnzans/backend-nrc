require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../model/File');
const FileUtils = require('../utils/FileUtils');
const { BaseModel, modelMap } = require('../model/Document');
const documentDir = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, documentDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('WrongFileType'), false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

/** Working As Intended */
async function uploadDocument(req, res) {
    upload.single('document')(req, res, async (err) => {
        if (err) {
            return res.status(err.message === 'WrongFileType' ? 400 : 500).json({
                success: false,
                message: err.message === 'WrongFileType' ? 'File type tidak diterima. Hanya menerima PDF' : `Gagal mengunggah file. \nError : ${err.message}`,
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message:'Tidak ada file yang diunggah'
            });
        }
        
        const { docType } = req.body;
        if (!docType || docType.trim() === '') {
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) {
                        console.error('Gagal menghapus file: ', err);
                    }
                });
            }

            return res.status(400).json({
                success: false,
                message: 'docType dibutuhkan'
            });
        }

        const pdfThumbnail = await FileUtils.convertPdfToImage(req.file.filename, req.file.path, 1);
        const fileData = new File({
            filename: req.file.filename,
            documentType: docType,
            path: req.file.path,
            thumbnail: pdfThumbnail
        });
        const savedFile = await fileData.save();

        return res.json({
            success: true,
            message:'File sukses diunggah',
            data: {
                file: savedFile
            }
        });
    });
}


async function getDocument(req,res) {
    const { docId } = req.params;
    BaseModel.findById(docId)
    .then(doc => {
        if (!doc) {
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan.'
            })
        } else {
            return res.json({
                success: true,
                message: 'Dokumen berhasil diambil.',
                data: doc
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan: ' + err
        })
    })
}

async function getFileDocument(req,res) {
    const { pdfOnly } = req.query;
    File.findOne({ filename: req.params.filename })
    .then(file => {
        if (!file) {
            return res.status(404).json({
                success: false,
                message:'File tidak ditemukan'
            });
        } else {
            return res.json({
                success: true,
                message: 'File berhasil diambil',
                data: file
            });
        }
    })
    .catch(err => {
        return res.status(404).json({ 
            success: false,
            message:'Terjadi Kesalahan: ' + err
        });
    });
}

async function getPdf(req,res) {
    const { responseType, requestedFile } = req.query;
    File.findOne({ filename: req.params.filename })
    .then(file => {
        if (!file) {
            return res.status(404).json('File yang dicari tidak ditemukan');
        } else {
            switch (requestedFile) {
                case 'pdf':
                    res.download(file.path, req.params.filename, (err) => {
                        if (err) return res.send('Terjadi kesalahan: ' + err.message);
                    });
                    break;
                default:
                    const thumbnail = fs.readFileSync(file.thumbnail);
                    res.header('Content-Type', 'image/png');
                    res.send(thumbnail);
            }
        }
    })
    .catch(err => {
        return res.status(500).send('Terjadi kesalahan: ' + err.message);
    })
}

async function getListOfFileDocuments(req,res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { docType, verificationStatus, startDate, endDate, keyword } = req.query;

    try {
        const query = {};
        if (docType) {
            if (Array.isArray(docType)) {
                query['docType'] = { $in: docType };
            } else {
                query['docType'] = docType;
            }
        }
        if (verificationStatus) query['verificationStatus'] = verificationStatus;

        if (startDate || endDate) {
            query['createdDate'] = {};
            if (startDate) {
                query['createdDate'].$gte = new Date(startDate);
            }
            if (endDate) {
                query['createdDate'].$lte = new Date(endDate);
            }
        }

        let totalDocuments;
        let documents;
        let Model;
        let keys = [];

        if (docType && docType.length === 1) {
            Model = modelMap[docType];
        } else {
            Model = BaseModel;
        }

        // belum bisa menangani keyword untuk beberapa jenis dokumen (hanya bisa satu jenis dokumen)
        if (keyword) {
            const sampleDocument = await Model.findOne(query).exec();
            if (sampleDocument) {
                keys = Object.keys(sampleDocument.toObject());
                const excludedKeys = ['_id', '__v','verificationStatus', 'hasPassedScreening', 'createdDate', 'docType']
                keys = keys.filter(key => !excludedKeys.includes(key));
                query['$or'] = keys.map(key => 
                    ({ 
                        [key]: { $regex: keyword, $options: 'i' } 
                    })
                );
            }
        }

        totalDocuments = await Model.countDocuments(query);
        documents = await Model.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    
        res.status(200).json({
            totalDocuments,
            totalPages: Math.ceil(totalDocuments / limit),
            currentPage: page,
            documents,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Gagal mendapatkan dokumen' + err.message
        });
    }
}

async function deleteFileDocument(req,res) {
    const { docId, filename } = req.body;
    const doc = await BaseModel.findById(docId);
        const file = await File.findOne({ filename: filename});
        if (process.env.NODE_ENV === 'development') {
            fs.readdir(documentDir, { withFileTypes: true, recursive: true }, (err,files) => {
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

module.exports = { uploadDocument, getDocument, getFileDocument, getPdf, getListOfFileDocuments, deleteFileDocument };