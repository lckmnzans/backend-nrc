// const { MongoClient } =  require('mongodb');
// var url = require('../config/keys').mongoUri;
// var dbClient = new MongoClient(url);

// const dbName = 'user';

// const dbConnect = async () => {
//     try {
//         await dbClient.connect();
//         console.log('Connected successfully to database server');
//         return 'done.'
//     } catch (err) {
//         console.error('Error connecting to database server')
//     }
// }

// const dbDisconnect = async () => {
//     await dbClient.close();
//     console.log('Connection closed');
// }

// const dbCollection = (docName) => {
//     const db = dbClient.db(dbName);
//     const collection = db.collection(docName);
//     return collection;
// }

// module.exports = { dbConnect, dbDisconnect, dbCollection };

const mongoose = require('mongoose');
const url = require('../config/keys').mongoUri;

function dbConnect() {
    mongoose.connect(url+"/test")
    .then(() => console.log("MongoDB connected"))
    .catch(console.error);
}

module.exports = dbConnect;