const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.send('GET request to the homepage')
})

router.post('/', (req,res) => {
    res.send('POST request to the homepage')
})

const userRoute = require('../controller/accountController');
router.use('/api/v1/', userRoute);

module.exports = router;