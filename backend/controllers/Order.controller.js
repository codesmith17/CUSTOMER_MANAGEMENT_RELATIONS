// Order.controller.js
// const Order = require('../models/Order.model');
const Customer = require('../models/Customer.model');
const { publishOrderToKafka } = require('../kafka/producer');

const postOrder = (req, res, next) => {
    const { productName, price } = req.body;
    const cost = price;

    const newOrder = {
        customerEmail: req.user.email,
        productName: productName,
        customerId: req.user.id,
        cost: cost,
    };

    publishOrderToKafka(newOrder)
        .then(() => {
            return Customer.findById(req.user.id);
        })
        .then((customer) => {
            if (customer) {
                customer.totalSpends = (customer.totalSpends || 0) + parseInt(cost);
                return customer.save();
            } else {
                console.error('Customer not found:', req.user.id);
                throw new Error('Customer not found.');
            }
        })
        .then((updatedCustomer) => {
            res.status(201).json({
                message: 'Order created successfully.',
                newOrder,
                updatedCustomer,
            });
        })
        .catch((err) => {
            console.error('Error creating order:', err);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        });
};

module.exports = { postOrder };