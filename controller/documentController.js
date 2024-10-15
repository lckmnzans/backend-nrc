const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../model/File');
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

router.post('/document', (req,res) => {
    upload.single('document')(req, res, async (err) => {
        if (err) {
            if (err.message == 'WrongFileType') {
                return res.status(400).json({ message:'File type not accepted. Only PDF accepted' });
            }
            return res.status(500).json({ message:'File upload failed', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message:'No file uploaded' });
        }

        const fileData = new File({
            filename: req.file.filename,
            path: req.file.path
        })
        const savedFile = await fileData.save();

        res.json({
            message:'File uploaded succesfully',
            file: savedFile
        })
    });
});

router.get('/document/:filename', (req,res) => {
    File.findOne({ filename: req.params.filename })
    .then((file) => {
        if (!file) {
            return res.status(404).json({ message:'File not found' });
        } else {
            res.download(file.path, req.params.filename+".pdf", (err) => {
                if (err) {
                    res.status(500).json({
                        error: err,
                        message: err.message
                    })
                }
            });
        }
    })
    .catch(() => {
        res.status(404).json({ message: 'File cannot be retrieved' });
    });
});


router.get('/list-document', (req,res) => {
    File.find({})
    .then((files) => {
        return res.status(200).json(files);
    })
    .catch((err) => {
        return res.status(500).json({ message: err.message });
    })
})
module.exports = router;