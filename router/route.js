const express = require('express');
const router = express.Router();
const passport = require('passport');
const checkUserRole = require('../validation/credential');

router.get('/', (req,res) => {
    res.send('GET request to the homepage')
})

router.post('/', (req,res) => {
    res.send('POST request to the homepage')
})

const accRoute = require('../router/account');
router.use('/api/v1/', accRoute);

const docRoute = require('../router/document');
router.use('/api/v1/', docRoute);

module.exports = router;