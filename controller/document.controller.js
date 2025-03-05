require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../model/File');
const FileUtils = require('../utils/FileUtils');
const PdfUtils = require('../utils/PdfUtils');
const { BaseModel, modelMap } = require('../model/Document');
const documentDir = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, documentDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, req.body.docType + '-' + uniqueSuffix + path.extname(file.originalname));
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

async function getSchema(req,res) {
    const schemaFile = path.join(__dirname, '..', 'docSchema.json');
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(schemaFile, (err) => {
        if (err) {
            res.status(500).send('Schema not found or error.');
        }
    })
}

async function uploadDocument(req, res) {
    upload.single('document')(req, res, async (err) => {
        if (err) {
            return res.status(err.message === 'WrongFileType' ? 400 : 500).json({
                success: false,
                message: err.message === 'WrongFileType' ? 'Hanya menerima PDF' : `Gagal mengunggah file. Error : ${err.message}`,
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message:'Tidak ada file yang diunggah'
            });
        }
        
        if (!req.body?.docType || req.body?.docType?.trim() === '') {
            if (req.file) {
                fs.unlink(path.join(documentDir, req.file.filename), err => {
                    if (err) {
                        console.error('Gagal menghapus file: ', err);
                    }
                    return res.status(err ? 500 : 400).json({
                        success: false,
                        message: err ? `Terjadi kesalahan. Error: ${err.message}` : 'docType dibutuhkan.'
                    })
                });
            }
        }

        const pdfThumbnail = await FileUtils.convertPdfToImage(req.file.filename, req.file.path, 1);
        const fileData = new File({
            filename: req.file.filename,
            documentType: docType,
            filePath: req.file.path,
            thumbnailPath: pdfThumbnail,
            uploader: req.user._id
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

async function uploadDocuments(req,res) {
    upload.array('documents')(req,res, async (err) => {
        if (err) {
            return res.status(err.message === 'WrongFileType' ? 400 : 500).json({
                success: false,
                message: err.message === 'WrongFileType' ? 'File type tidak diterima. Hanya menerima PDF' : `Gagal mengunggah file. Error : ${err.message}`,
            });
        }

        if (!req.files) {
            return res.status(400).json({ 
                success: false,
                message:'Tidak ada file yang diunggah'
            });
        }

        const { docType } = req.body;
        if (!docType || docType.trim() === '') {
            if (req.files.length > 1) {
                for (let file of req.files) {
                    fs.unlink(file.path, err => {
                        if (err) console.log('Gagal menghapus file');
                    })
                }
            } else if (req.files[0]) {
                fs.unlink(req.files[0].path, err => {
                    if (err) console.log('Gagal menghapus file');
                })
            }

            return res.status(400).json({
                success: false,
                message: 'docType dibutuhkan'
            });
        }

        let filename = req.files[0]?.filename;
        let filepath = req.files[0]?.path;

        if (req.files && req.files.length > 1) {
            const filePaths = [];
            for (let file of req.files) {
                filePaths.push(file.path);
            }
            filename = await PdfUtils.mergePDFs(req.files[0]?.filename, filePaths);
            filepath = `${documentDir}/${filename}`;

            filePaths.forEach(filePath => {
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error('Gagal menghapus file: ', err);
                    }
                });
            })
        }

        if (!filename || !filepath) {
            return res.status(400).json({
                success: false,
                message: 'Permintaan tidak bisa dipenuhi'
            })
        }
        
        const pdfThumbnail = await FileUtils.convertPdfToImage(filename, filepath, 1);
        const file = new File({
            filename: filename,
            filePath: filepath,
            documentType: req.body.docType,
            thumbnailPath: pdfThumbnail,
            uploader: req.user._id
        })
        const savedFile = await file.save();

        return res.json({
            success: true,
            message:'Files sukses diunggah',
            data: {file: savedFile}
        });
    })
}

async function getDocument(req,res) {
    const { docId } = req.params;
    BaseModel.findById(docId).populate('fileRef')
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
    File.findOne({ filename: req.params.filename }).populate('uploader')
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
            /** using absolute path */
            // switch (requestedFile) {
            //     case 'pdf':
            //         res.download(file.filePath, req.params.filename, (err) => {
            //             if (err) return res.send('Terjadi kesalahan: ' + err.message);
            //         });
            //         break;
            //     default:
            //         const thumbnail = fs.readFileSync(file.thumbnailPath);
            //         res.header('Content-Type', 'image/png');
            //         res.send(thumbnail);
            // }

            /** using relative path */
            switch (requestedFile) {
                case 'pdf':
                    res.download(`${documentDir}/${req.params.filename}`, req.params.filename, (err) => {
                        if (err) return res.send('Terjadi kesalahan: ' + err.message);
                    });
                    break;
                default:
                    const thumbnail = fs.readFileSync(`${documentDir}/thumbnails/${req.params.filename}.1.png`);
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
    const { docType, verificationStatus, startDate, endDate, keyword, withFileDetail } = req.query;

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
                const excludedKeys = ['_id', '__v','verificationStatus', 'hasPassedScreening', 'createdDate', 'docType', 'fileRef']
                keys = keys.filter(key => !excludedKeys.includes(key));
                query['$or'] = keys.map(key => 
                    ({ 
                        [key]: { $regex: keyword, $options: 'i' } 
                    })
                );
            }
        }

        totalDocuments = await Model.countDocuments(query);
        if (withFileDetail) {
            documents = await Model.find(query).populate('fileRef')
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        } else {
            documents = await Model.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        }
    
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
    const { softDelete } = req.query;
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
                    console.log(`[${fileId}]: `+files[fileId].name);
                }
            }
        });
    }
    if (doc && file) {
        if (softDelete) {
            file.deleted = true;
            await file.save();
            return res.json({
                success: true,
                message: 'File sudah ditandai terhapus'
            })
        }

        try {
            /** using absolute path */
            // await FileUtils.deleteFile(file.filePath);
            // await File.deleteOne({ filename: filename });
            // await BaseModel.deleteOne({ docName: doc.docName });
            // console.log('File deleted successfully');

            // try {
            //     await FileUtils.deleteFile(file.thumbnailPath);
            //     console.log('Thumbnail deleted');
            // } catch(err) {
            //     console.log('Error deleting document thumbnail. Error: ' + err);
            // }

            /** using relative path */
            await FileUtils.deleteFile(`${documentDir}/${filename}`);
            await File.deleteOne({ filename: filename });
            await BaseModel.deleteOne({ docName: doc.docName });
            console.log('File deleted successfully');

            try {
                await FileUtils.deleteFile(`${documentDir}/thumbnails/${filename}.1.png`);
                console.log('Thumbnail deleted');
            } catch(err) {
                console.log('Error deleting document thumbnail. Error: ' + err);
            }
    
            return res.json({
                success: true,
                message: 'Dokumen berhasil dihapus',
            })
        } catch(err) {
            console.log('Error deleting document file. Error: ' + err);
            return res.json({
                success: true,
                message: 'Dokumen gagal dihapus',
            })
        }
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
        message: 'Dokumen tidak ditemukan. Apakah docId dan filename sudah benar?'
    });
}

module.exports = { getSchema, uploadDocument, uploadDocuments, getDocument, getFileDocument, getPdf, getListOfFileDocuments, deleteFileDocument };