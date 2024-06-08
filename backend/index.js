const express = require('express');
require('dotenv').config();
const process = require("process")
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const authRoutes = require("./routes/Auth.route");;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
// console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        console.log("CONNECTED");
        app.listen(PORT, () => console.log(`Dolphin app listening on port ${PORT}!`));
    })
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/auth", authRoutes);