const express = require("express");
const router = express.Router();

const { postOrder } = require("../controllers/Order.controller.js");
const { verifyCustomer } = require("../controllers/Auth.controller.js");




router.post("/postOrder", verifyCustomer, postOrder);

// router.get("/getOthersData/:username", getOthersData);
// router.get("/getUserData", verifyUser, getUserData);
// router.post("/forgotPassword", forgotPassword);
// router.post("/resetPassword", resetPassword);
// router.get("/getOthersData", getOthersData);
// router.post('/google', google);
module.exports = router;