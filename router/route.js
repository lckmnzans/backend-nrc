const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.send('GET request to the homepage')
})

router.post('/', (req,res) => {
    res.send('POST request to the homepage')
})

const userRoute = require('../controller/userController');
router.use('/users', userRoute);

module.exports = router;