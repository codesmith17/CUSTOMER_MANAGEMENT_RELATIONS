// const jwtSecret = process.env.JWT_SECRET;
// const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
// const moment = require("moment")

const Order = require("../models/Order.model.js");
const Customer = require("../models/Customer.model.js")
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer")
// const crypto = require("crypto-js");

const campaignFilter = (req, res, next) => {
    const { situations, logic, filterValues } = req.body;
    const { spendAmount, spendOperator, spendAmountSecond, visitOperator, maxVisits, notVisitedMonths } = filterValues;

};










module.exports = { campaignFilter };