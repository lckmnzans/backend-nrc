const express = require('express');
const router = express.Router();
const accountController = require('../controller/account.controller');
const passport = require('passport');
const checkUserRole = require('../validation/credential');

router.post('/login', passport.authenticate('local'), accountController.login);
router.post('/register', passport.authenticate('jwt', { session: false }), checkUserRole(['superadmin']), accountController.register);
router.post('/profile',  passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), accountController.getToProfile);
router.get('/', passport.authenticate('jwt', { session: false}), checkUserRole(['superadmin']), accountController.getAllAccounts);
router.get('/:id', passport.authenticate('jwt', { session: false }), checkUserRole(['user','admin','superadmin']), accountController.getAccount);
router.patch('/',  passport.authenticate('jwt', { session: false }), checkUserRole(['user','admin','superadmin']), accountController.updateAccount);
router.post('/request-reset', accountController.requestResetPassword);
router.post('/approve-reset/:userId', passport.authenticate('jwt', { session: false }), checkUserRole(['superadmin']),  accountController.approveResetPassword);
router.post('/reset-pass', accountController.resetPassword);
router.delete('/', passport.authenticate('jwt', { session: false }), checkUserRole(['superadmin']), accountController.deleteAcc);

module.exports = router;