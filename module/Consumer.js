require('dotenv').config();
const { Kafka } = require('kafkajs');

class Consumer {
    constructor(clientId, brokers, groupId) {
        this.kafka = new Kafka({
            clientId: clientId,
            brokers: brokers
        });
        this.consumer = this.kafka.consumer({ groupId });
        this.handlers = {};
    }

    async connect() {
        try {
            await this.consumer.connect();
            console.log('\x1b[36m%s\x1b[0m', 'Connected to message broker');
        } catch(err) {
            console.error('Failed connecting to broker: ', err);
        }
    }

    async subscribe(topics) {
        try {
            for (const topic of topics) {
                await this.consumer.subscribe({ topic, fromBeginning: true });
                console.log(`Subscribed to topic: ${topic}`);
            }
        } catch(err) {
            console.error('Subscription failed: ', err);
        }
    }

    setHandler(topic, handler) {
        this.handlers[topic] = handler;
    }

    async runc() {
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const json = JSON.parse(message.value.toString());
                    if (this.handlers[topic]) {
                        await this.handlers[topic](json);
                    } else {
                        console.warn(`No handler found for topic: ${topic}`);
                    }
                } catch(err) {
                    console.error(`Error processing message from ${topic} partition ${partition} offset ${message.offset}: `, err);
                }
            }
        })
    }

    async disconnect() {
        await this.consumer.disconnect();
        console.log('Consumer disconnected');
    }
}

module.exports = Consumer;