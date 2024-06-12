const express = require("express");
const router = express.Router();


const { postDeliveryStatus, getDeliveryTable } = require("../controllers/DeliveryStatus.controller.js");




router.post("/deliveryStatus", postDeliveryStatus);
router.get("/getDeliveryTable", getDeliveryTable)
    // router.get("/getOthersData/:username", getOthersData);
    // router.get("/getUserData", verifyUser, getUserData);
    // router.post("/forgotPassword", forgotPassword);
    // router.post("/resetPassword", resetPassword);
    // router.get("/getOthersData", getOthersData);
    // router.post('/google', google);
module.exports = router;