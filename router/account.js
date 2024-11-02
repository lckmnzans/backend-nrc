const express = require('express');
const router = express.Router();
const accountController = require('../controller/accountController');
const passport = require('passport');
const checkUserRole = require('../validation/credential');

router.post('/login', passport.authenticate('local'), accountController.login);
router.post('/register', passport.authenticate('jwt', { session: false }), checkUserRole(['superadmin']), accountController.register);
router.post('/profile',  passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), accountController.getToProfile);
router.get('/account', passport.authenticate('jwt', { session: false}), checkUserRole(['superadmin']), accountController.getAllAccounts);
router.get('/account/:username', passport.authenticate('jwt', { session: false }), checkUserRole(['superadmin']), accountController.getAccount);
router.patch('/account',  passport.authenticate('jwt', { session: false }), checkUserRole(['admin','superadmin']), accountController.changePassword);
router.post('/request-reset', accountController.requestResetPassword);
router.post('/approve-reset/:userId', passport.authenticate('jwt', { session: false }), checkUserRole(['superadmin']),  accountController.approveResetPassword);
router.post('/reset-pass', accountController.resetPassword);

module.exports = router;