const { MongoClient } =  require('mongodb');
var url = 'mongodb://localhost:27017';
var client = new MongoClient(url);

const dbName = 'test';

async function dbStart() {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('documents')

    return 'done.';
}

dbStart()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());

// module.exports = start;