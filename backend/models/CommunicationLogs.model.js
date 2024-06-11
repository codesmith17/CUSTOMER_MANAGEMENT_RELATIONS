const mongoose = require('mongoose');

const communicationLogsSchema = new mongoose.Schema({
    audience: [{
        customerEmail: {
            type: String,
            required: true,
            trim: true
        },
        customerName: {
            type: String,
            required: true,
            trim: true
        }
    }],

    message: {
        type: String,
        required: true,
        default: "HELLO ${name}"
    },
    discountPercentage: {
        type: Number,
        ref: 'Customer',
        required: true
    },
    date: {
        type: Date,
        required: true,

    },

});

const communicationLogs = mongoose.model('communication_logs', communicationLogsSchema);
module.exports = communicationLogs;