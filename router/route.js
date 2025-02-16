const express = require('express');
const router = express.Router();

const accRoute = require('../router/account.router');
router.use('/api/v1/account', accRoute);

const docRoute = require('../router/document.router');
router.use('/api/v1/document', docRoute);

module.exports = router;