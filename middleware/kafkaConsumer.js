const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'backend-nrc',
    brokers: ['localhost:9092']
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
        console.log('\x1b[36m%s\x1b[0m', 'Connected to message broker')
        await consumer.subscribe({ topic: topic, fromBeginning: true});
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`Received message: ${message.value.toString()}`);
            },
        });
    })
    .catch(console.error);
 }