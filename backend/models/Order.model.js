const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true,
    },
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    cost: {
        type: Number,
        required: true,
        default: 0
    },

});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;