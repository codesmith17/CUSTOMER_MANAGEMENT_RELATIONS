// const jwtSecret = process.env.JWT_SECRET;
// const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
// const moment = require("moment")

const Order = require("../models/Order.model.js");
const Customer = require("../models/Customer.model.js")
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer")
// const crypto = require("crypto-js");

const postOrder = (req, res, next) => {
    const { productName, price } = req.body;
    console.log(req.body, req.user);
    // Calculate cost
    const cost = (price);

    Order.create({
            customerEmail: req.user.email,
            productName: productName,
            customerId: req.user.id,
            cost: cost
        })
        .then(newOrder => {
            // Fetch the customer
            Customer.findById(req.user.id)
                .then(customer => {
                    // Update totalSpends
                    console.lo
                    customer.totalSpends = (customer.totalSpends || 0) + parseInt(cost); // Ensure totalSpends is a number

                    // Save the customer object
                    return customer.save()
                        .then(updatedCustomer => {
                            res.status(201).json({
                                message: "Order created successfully.",
                                newOrder,
                                updatedCustomer
                            });
                        })
                        .catch(err => {
                            console.error("Error saving customer after updating totalSpends:", err);
                            res.status(500).json({ message: "Server error. Please try again later." });
                        });
                })
                .catch(err => {
                    console.error("Error finding customer:", err);
                    res.status(500).json({ message: "Server error. Please try again later." });
                });
        })
        .catch(err => {
            console.error("Error creating order:", err);
            res.status(500).json({ message: "Server error. Please try again later." });
        });
};










module.exports = { postOrder };