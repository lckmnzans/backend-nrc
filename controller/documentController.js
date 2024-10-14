const express = require('express');
const router = express.Router();
const multer = require('multer');
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
    upload.single('document')(req, res, (err) => {
        if (err) {
            if (err.message == 'WrongFileType') {
                return res.status(400).json({ message:'File type not accepted. Only PDF accepted' });
            }
            return res.status(500).json({ message:'File upload failed', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message:'No file uploaded' });
        }

        res.json({
            message:'File uploaded succesfully',
            file: req.file
        })
    });
})

module.exports = router;