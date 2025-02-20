const express = require('express');
const router = express.Router();
const documentController = require('../controller/document.controller');
const archivingController = require('../controller/archiving.controller');
const passport = require('passport');
const checkUserRole = require('../validation/credential');

router.post('/', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.uploadDocument); // not in use
router.post('/multi', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.uploadDocuments)
router.post('/:docType', passport.authenticate('jwt', { session: false }), checkUserRole(['admin', 'superadmin']), archivingController.saveDocData);
router.post('/pdf/translate', passport.authenticate('jwt', { session: false }), checkUserRole(['user','admin','superadmin']), archivingController.translateDocFile);
router.get('/', documentController.getSchema);
router.get('/file/:filename', passport.authenticate('jwt', { session: false }), checkUserRole(['user','admin','superadmin']), documentController.getFileDocument);
router.get('/pdf/:filename', documentController.getPdf);
router.get('/pdf/translate/:reqId', archivingController.getTranslatedDocFile);
router.get('/pdf/translate/status/:reqId', archivingController.getTranslationStatus);
router.get('/docs/:docId', passport.authenticate('jwt', { session: false }), checkUserRole(['user','admin','superadmin']), documentController.getDocument);
router.get('/list-document', passport.authenticate('jwt', { session: false }), checkUserRole(['user','admin','superadmin']), documentController.getListOfFileDocuments);
router.patch('/docs/:docType/:docId', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), archivingController.updateDocData);
router.delete('/docfile', passport.authenticate('jwt', { session: false}), checkUserRole(['admin','superadmin']), documentController.deleteFileDocument);

module.exports = router;