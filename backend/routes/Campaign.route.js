const express = require("express");
const router = express.Router();

const { campaignFilter, postFilteredTable, getFilteredTable } = require("../controllers/Campaign.controller.js");




router.post("/campaign-filter", campaignFilter);
router.post("/postFilteredTable", postFilteredTable);
router.get("/getFilteredTable", getFilteredTable);
// router.get("/getOthersData/:username", getOthersData);
// router.get("/getUserData", verifyUser, getUserData);
// router.post("/forgotPassword", forgotPassword);
// router.post("/resetPassword", resetPassword);
// router.get("/getOthersData", getOthersData);
// router.post('/google', google);
module.exports = router;