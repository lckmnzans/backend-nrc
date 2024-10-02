require('dotenv').config()

module.exports = {
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017",
}