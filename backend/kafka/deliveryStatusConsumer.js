// DeliveryStatusConsumer.js
const { Kafka } = require('kafkajs');
const DeliveryStatus = require('../models/DeliveryStatus.model');
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'delivery-group' });

const startDeliveryStatusConsumer = () => {
    consumer.connect()
        .then(() => {
            console.log('Kafka consumer connected');
            return consumer.subscribe({ topic: 'delivery-topic', fromBeginning: true });
        })
        .then(() => {
            return consumer.run({
                eachMessage: async({ topic, partition, message }) => {
                    const deliveryStatusData = JSON.parse(message.value.toString());
                    console.log('Received DeliveryStatus:', deliveryStatusData);

                    const newDeliveryStatus = new DeliveryStatus(deliveryStatusData);
                    console.log(newDeliveryStatus);
                    newDeliveryStatus.save()
                        .then(() => {
                            console.log('DeliveryStatus saved to MongoDB:', newDeliveryStatus);
                        })
                        .catch(err => console.error('Error saving to MongoDB:', err));
                },
            });
        })
        .catch((err) => {
            console.error('Error in Kafka consumer:', err);
        });
};

module.exports = { startDeliveryStatusConsumer };