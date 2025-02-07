require('dotenv').config();
const { Kafka } = require('kafkajs');
const DocumentService = require('../service/DocumentService');
const kafka = new Kafka({
    clientId: 'backend-nrc',
    brokers: [process.env.BROKERS]
})
const consumer = kafka.consumer({ groupId: 'test-group' });

process.on('SIGINT', async () => {
    console.log('\nShutting down consumer...');
    await consumer.disconnect();
    process.exit(0);
});

module.exports = function (topic) { 
    consumer.connect()
    .then(async () => {
        console.log('\x1b[36m%s\x1b[0m', 'Connected to message broker');
        await consumer.subscribe({ topic: topic, fromBeginning: true});
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const json = JSON.parse(message.value.toString())
                try {
                    const result = json.message;
                    const docType = DocumentService.getDocTypeByName(json.message.doc_type);
                    const docId = json.message.doc_id;

                    console.log(`Hasil OCR diterima untuk dokumen ${docId}`);
                    DocumentService.ocrResultModelMapper(docType, docId, result.result);
                } catch(err) {
                    console.error(`Kesalahan pada ${topic} ${partition} ${message.offset} ${err}`);
                }
            },
        });
    })
    .catch(err => {
        console.log('Broker fails to connect');
        console.log(err);
    });
 }