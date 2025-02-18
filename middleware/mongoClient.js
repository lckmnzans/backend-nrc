const mongoose = require('mongoose');
const url = require('../config/keys').mongoUri;
const MongoUtils = require('../utils/MongoUtils');

module.exports = async function() {
    mongoose.connect(url+"/test?authSource=admin")
    .then((mongo) => { 
        console.log('\x1b[36m%s\x1b[0m', 'MongoDB connected');
        
        mongoose.connection.on('connected', async () => {
            MongoUtils.checkAndInsertUser();
        });
    })
    .catch((err) => console.log('\x1b[31m%s\x1b[0m', err));
};