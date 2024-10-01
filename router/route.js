const express = require('express');
const router = express.Router();
const { dbConnect, dbDisconnect } = require('../middleware/mongo_client');

router.get('/', (req,res) => {
    res.send('GET request to the homepage')
})

router.post('/', (req,res) => {
    res.send('POST request to the homepage')
})

module.exports = router;