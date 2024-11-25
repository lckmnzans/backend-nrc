require('dotenv').config();

module.exports = {
    hostname: process.env.SERVER_HOSTNAME || "localhost",
    port: process.env.SERVER_PORT || 8000,
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017",
    vueUri: process.env.VUE_URI
};