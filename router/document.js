const express = require('express');
const router = express.Router();
const documentController = require('../controller/documentController');
const passport = require('passport');
const checkUserRole = require('../validation/credential');

router.post('/document', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.uploadDocument);
router.get('/document/:filename', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.getDocument);
router.get('/list-document', passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), documentController.getListOfDocuments);

module.exports = router;