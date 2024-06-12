const mongoose = require('mongoose');

const DeliveryStatusSchema = new mongoose.Schema({

    campaignId: {
        type: mongoose.Types.ObjectId,
        ref: 'communication_logs',
        required: true
    },
    message: {
        type: String,
        required: true,

    },
    customerEmail: {
        type: String,
        required: true,
        trim: true
    },
    deliveryStatus: {
        type: String,
        requried: true,
        default: "FAILED"
    }

});

const DeliveryStatus = mongoose.model('DeliveryStatus', DeliveryStatusSchema);
module.exports = DeliveryStatus;