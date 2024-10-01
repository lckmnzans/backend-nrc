const { dbConnect, dbDisconnect, dbCollection } = require('../middleware/mongo_client');

function getDb(docName) {
    dbConnect().then(() => {
        const collection = dbCollection(docName)
        return collection
    }).catch(console.error).finally(dbDisconnect())
}

function endDb() {
    dbDisconnect()
}