const mongoose = require('mongoose');
const url = require('../config/keys').mongoUri;

module.exports = async function() {
    mongoose.connect(url+"/test?authSource=admin")
    .then(() => console.log('\x1b[36m%s\x1b[0m', 'MongoDB connected'))
    .catch((err) => console.log('\x1b[31m%s\x1b[0m', err));
};