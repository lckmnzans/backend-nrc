const { MongoClient } =  require('mongodb');
var url = 'mongodb://127.0.0.1:27017';
var dbClient = new MongoClient(url);

const dbName = 'test';

const dbConnect = async () => {
    try {
        await dbClient.connect();
        console.log('Connected successfully to database server');
        return 'done.'
    } catch (err) {
        console.error('Error connecting to database server')
    } finally {
        await dbClient.close();
        console.log('Connection closed')
    }
}
module.exports = { dbConnect };