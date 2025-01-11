const express = require('express');
const router = express.Router();
const documentController = require('../controller/document.controller');
const archivingController = require('../controller/archiving.controller');
const passport = require('passport');
const checkUserRole = require('../validation/credential');

router.post('/', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.uploadDocument);
router.post('/:docType', passport.authenticate('jwt', { session: false }), checkUserRole(['admin', 'superadmin']), archivingController.saveDocData);
router.get('/file/:filename', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.getFileDocument);
router.get('/docs/:docId', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.getDocument);
router.get('/list-document', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.getListOfFileDocuments);
router.patch('/docs/:docType/:docId', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), archivingController.updateDocData);
router.delete('/docfile', passport.authenticate('jwt', { session: false}), checkUserRole(['superadmin']), documentController.deleteFileDocument);

module.exports = router;