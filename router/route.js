const express = require('express');
const router = express.Router();
const mongoClient = require('../model/mongo_client');

router.get('/', (req,res) => {
    res.send('GET request to the homepage')
})

router.post('/', (req,res) => {
    res.send('POST request to the homepage')
})

router.get('/test', (req,res) => {
    try {
        mongoClient.start();
        res.send("Database successfully created")
    } catch (err) {
        res.send("Error occured");
    }
})

module.exports = router;