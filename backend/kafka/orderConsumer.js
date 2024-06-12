const { Kafka } = require('kafkajs');
const Order = require('../models/Order.model');
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'order-group' });

const startOrderConsumer = () => {
    consumer.connect()
        .then(() => {
            console.log('Kafka consumer connected');
            return consumer.subscribe({ topic: 'order-topic', fromBeginning: true });
        })
        .then(() => {
            return consumer.run({
                eachMessage: ({ topic, partition, message }) => {
                    const order = JSON.parse(message.value.toString());
                    console.log('Received order:', order);

                    const newOrder = new Order(order);
                    console.log(newOrder);
                    newOrder.save()
                        .then(() => {
                            console.log('Order saved to MongoDB:', newOrder);
                        })
                        .catch(err => console.error(err))

                },
            });
        })
        .catch((err) => {
            console.error('Error in Kafka consumer:', err);
        });
};

module.exports = { startOrderConsumer };