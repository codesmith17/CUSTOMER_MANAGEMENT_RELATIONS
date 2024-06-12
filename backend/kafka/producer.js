const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

const connectProducer = () => {
    return producer.connect()
        .then(() => {
            console.log('Kafka producer is connected');
        })
        .catch((error) => {
            console.error('Error connecting Kafka producer:', error);
            throw error; // Optionally, you can throw the error to handle it further up the call stack
        });
};

const publishOrderToKafka = (order) => {
    return producer.send({
            topic: 'order-topic',
            messages: [{ value: JSON.stringify(order) }],
        })
        .then(() => {
            console.log('Order published to Kafka successfully');
        })
        .catch((error) => {
            console.error('Error publishing order to Kafka:', error);
            throw error; // Optionally, you can throw the error to handle it further up the call stack
        });
};
const publishDeliveryStatusToKafka = (deliveryStatus) => {
    return producer.send({
            topic: "delivery-topic",
            messages: [{ value: JSON.stringify(deliveryStatus) }],
        })
        .then(() => {
            console.log("Delivery Status published to Kafka successfully");
        })
        .catch((error) => {
            console.error('Error publishing order to Kafka:', error);
            throw error;
        })
}
module.exports = {
    connectProducer,
    publishOrderToKafka,
    publishDeliveryStatusToKafka
};