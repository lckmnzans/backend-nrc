require('dotenv').config();
const multer = require('multer');
const File = require('../model/File');
const { BaseModel } = require('../model/Document');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
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

async function uploadDocument(req, res) {
    upload.single('document')(req, res, async (err) => {
        if (err) {
            if (err.message == 'WrongFileType') {
                return res.status(400).json({
                    success: false,
                    message: 'File type not accepted. Only PDF accepted' 
                });
            }
            return res.status(500).json({ 
                success: false,
                message: `File upload failed. Cause: ${err.message}`
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message:'No file uploaded'
            });
        }
        
        const docType = req.body.docType;
        if (!docType || docType.trim() === '') {
            if (req.file) {
                const fs = require('fs');
                fs.unlink(req.file.path, err => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
            }

            return res.status(400).json({
                success: false,
                message: 'docType is required'
            });
        }

        const fileData = new File({
            filename: req.file.filename,
            documentType: docType,
            path: req.file.path
        });
        const savedFile = await fileData.save();

        return res.json({
            success: true,
            message:'File uploaded succesfully',
            data: {
                file: savedFile
            }
        });
    });
}

async function getFileDocument(req,res) {
    File.findOne({ filename: req.params.filename })
    .then((file) => {
        if (!file) {
            return res.status(404).json({
                success: false,
                message:'File not found' });
        } else {
            res.download(file.path, req.params.filename+".pdf", (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }
            });
        }
    })
    .catch(() => {
        return res.status(404).json({ 
            success: false,
            message:'File cannot be retrieved'
        });
    });
}

async function getListOfFileDocuments(req,res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { docType, verificationStatus } = req.query;

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

        const totalDocuments = await BaseModel.countDocuments(query);

        const documents = await BaseModel.find(query)
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
        res.status(500).json({ error: 'Failed to retrieve documents', details: err.message });
    }
}

async function deleteFileDocument(req,res) {
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

module.exports = { uploadDocument, getFileDocument, getListOfFileDocuments, deleteFileDocument };