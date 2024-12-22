const mongoose = require('mongoose');
const url = require('../config/keys').mongoUri;

module.exports = function() {
    mongoose.connect(url+"/test")
    .then(() => console.log('\x1b[36m%s\x1b[0m', 'MongoDB connected'))
    .catch(err => console.error);
};