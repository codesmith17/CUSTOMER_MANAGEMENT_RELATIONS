const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectProducer } = require('./kafka/producer.js');
require('dotenv').config();
const { startOrderConsumer } = require("./kafka/orderConsumer.js");
const { startDeliveryStatusConsumer } = require("./kafka/deliveryStatusConsumer.js")
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');

        // Connect Kafka producer inside the mongoose.connect block
        return connectProducer();
    })
    .then(() => {

        console.log('Kafka producer is connected');
        startOrderConsumer();
        startDeliveryStatusConsumer();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB or Kafka:', err);
        process.exit(1); // Exit process with failure
    });

app.use(bodyParser.urlencoded({ extended: false }));

// Routes setup
const authRoutes = require('./routes/Auth.route');
const orderRoutes = require('./routes/Order.route');
const campaignRoutes = require('./routes/Campaign.route.js');
const deliveryRoutes = require("./routes/DeliveryStatus.route.js")
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/campaign', campaignRoutes);
app.use("/api/delivery", deliveryRoutes);

module.exports = app;