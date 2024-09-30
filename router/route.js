const express = require('express');
const router = express.Router();
const { dbConnect } = require('../middleware/mongo_client');

router.get('/', (req,res) => {
    res.send('GET request to the homepage')
})

router.post('/', (req,res) => {
    res.send('POST request to the homepage')
})

router.get('/test', (req,res) => {
    dbConnect().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.error(err);
        res.send(err)
    });
})

module.exports = router;