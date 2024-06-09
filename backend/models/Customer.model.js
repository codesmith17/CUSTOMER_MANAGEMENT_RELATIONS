const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    resetToken: {
        type: String,
        required: false,
        default: null
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    totalSpends: {
        type: Number,
        default: 0
    },
    visits: {
        type: Number,
        default: 0
    },
    lastVisit: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;