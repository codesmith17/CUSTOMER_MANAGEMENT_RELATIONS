const express = require("express");
const router = express.Router();

const { campaignFilter } = require("../controllers/Campaign.controller.js");




router.post("/campaignFilter", campaignFilter);

// router.get("/getOthersData/:username", getOthersData);
// router.get("/getUserData", verifyUser, getUserData);
// router.post("/forgotPassword", forgotPassword);
// router.post("/resetPassword", resetPassword);
// router.get("/getOthersData", getOthersData);
// router.post('/google', google);
module.exports = router;