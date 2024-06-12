const express = require("express");
const router = express.Router();

const { signin, verifyCustomer, signup, verifyAdmin } = require("../controllers/Auth.controller.js");




router.post("/signin/:source?", signin);
router.get("/verify/:source?", verifyCustomer);
router.post("/signup", signup);
router.get("/verifyAdmin", verifyAdmin)
    // router.get("/getOthersData/:username", getOthersData);
    // router.get("/getUserData", verifyUser, getUserData);
    // router.post("/forgotPassword", forgotPassword);
    // router.post("/resetPassword", resetPassword);
    // router.get("/getOthersData", getOthersData);
    // router.post('/google', google);
module.exports = router;