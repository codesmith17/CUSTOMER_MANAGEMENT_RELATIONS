const DeliveryStatus = require('../models/DeliveryStatus.model');
const { publishDeliveryStatusToKafka } = require('../kafka/producer');
const getDeliveryTable = async(req, res) => {

    DeliveryStatus.find().sort({ _id: -1 })
        .then(filteredTable => {
            if (filteredTable.length > 0) {
                res.status(201).json(filteredTable);
            }
        }).catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        })

};
const postDeliveryStatus = (req, res, next) => {
    const { customerId, campaignId, message, customerEmail } = req.body;

    let countGt9 = 0,
        countLt9 = 0;
    for (let i = 0; i < 10; i++) {
        if (Math.random() <= 0.9)
            countGt9++;
        else
            countLt9++;
    }
    const deliveryStatus = countGt9 >= countLt9 ? "MESSAGE SENT SUCCESSFULLY" : "MESSAGE SENDING FAILED";
    const newDeliveryStatus = {
        customerId,
        campaignId,
        message,
        customerEmail,
        deliveryStatus
    };

    publishDeliveryStatusToKafka(newDeliveryStatus)
        .then(savedStatus => {
            res.status(201).json({
                message: 'Delivery status created and published to Kafka successfully.',
                deliveryStatus: savedStatus
            });
        })
        .catch(error => {
            console.error('Error handling delivery status:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        });
};

module.exports = { postDeliveryStatus, getDeliveryTable };