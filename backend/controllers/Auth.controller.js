const jwtSecret = process.env.JWT_SECRET;
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const moment = require("moment")

const Customer = require("../models/Customer.model.js");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer")
// const crypto = require("crypto-js");
const bcryptjs = require('bcrypt');
const verifyAdmin = (req, res, next) => {
    let token = req.headers && req.headers.cookie ? req.headers.cookie.split("access_token=")[1] : null;
    if (!token) {
        res.status(401).json({ message: "UNAUTHORIZED, LOGIN AGAIN WITH YOUR CREDENTIALS" });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.error("Token verification error: ", error);
            return res.status(500).json({ message: "Failed to authenticate token." });
        }
        req.user = user;
        res.status(201).json({ user });
        return;
    })
    return;
}
const verifyCustomer = (req, res, next) => {
    // console.log("!", req.headers)

    let token = req.headers && req.headers.cookie ? req.headers.cookie.split("access_token=")[1] : null;
    // const likes = "likes";
    // console.log("TOKEN:", req.headers.cookie);
    // const source = req.params ? req.params.source : null;
    // console.log(source);
    // if (!token && source === likes) {
    //     next();
    //     return;
    // }
    console.log(token);
    if (!token) {
        res.status(401).json({ message: "UNAUTHORIZED, LOGIN AGAIN WITH YOUR CREDENTIALS" });
        return;
    }
    if (token.includes(";"))
        token = token.split(";")[0];
    // console.log("kissss", token);
    if (!token) {
        return res.status(403).json({ message: "No token provided." });
    }
    // console.log("123")
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.error("Token verification error: ", error);
            return res.status(500).json({ message: "Failed to authenticate token." });
        }
        // console.log("user", decoded);
        req.user = user;
        if (req.params.source === "signin")
            res.status(200).json({ message: "User verified.", data: req.user });
        next();
    });
};




const signin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email.trim() === "" || password.trim() === "") {
        if (!req.params || !req.params.source === "google")
            return res.status(400).json({ message: "Email and password are required." });
    }
    console.log(req.body);
    Customer.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            if (req.params && req.params.source === "google") {
                user.visits += 1;
                user.lastVisit = Date.now();
                return user.save().then(updatedUser => {
                    const token = jwt.sign({ id: updatedUser._id, email: email, isAdmin: updatedUser.isAdmin }, jwtSecret, {
                        expiresIn: "24h",
                    });

                    return res.cookie("access_token", token, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000, // 1 day
                    }).status(200).json({
                        message: "Authentication successful.",
                        user: {
                            name: updatedUser.name,
                            access_token: token,
                        },
                    });
                });
            } else {
                return bcryptjs.compare(password, user.password)
                    .then(isEqual => {
                        if (!isEqual) {
                            return res.status(401).json({ message: "Invalid credentials." });
                        }

                        user.visits += 1;
                        user.lastVisit = Date.now();
                        return user.save().then(updatedUser => {
                            const token = jwt.sign({ id: updatedUser._id, email: email, isAdmin: updatedUser.isAdmin }, jwtSecret, {
                                expiresIn: "24h",
                            });

                            return res.cookie("access_token", token, {
                                httpOnly: true,
                                maxAge: 24 * 60 * 60 * 1000, // 1 day
                            }).status(200).json({
                                message: "Authentication successful.",
                                user: {
                                    name: updatedUser.name,
                                    access_token: token,
                                },
                            });
                        });
                    });
            }
        })
        .catch(err => {
            console.error("Error during authentication.", err);
            return res.status(500).json({ message: "Internal server error." });
        });
};







const signup = (req, res) => {
    const { name, email, password, confirmPassword, phoneNumber, address, dateOfBirth, checked } = req.body;
    console.log(phoneNumber)
    if (!checked) {
        return res.status(401).json({ message: "YOU HAVE TO AGREE TO OUR TERMS AND CONDITIONS" });
    }

    if (!name || !email || !password || !confirmPassword || !phoneNumber || !address || !dateOfBirth ||
        name.trim() === "" || email.trim() === "" || password.trim() === "" ||
        confirmPassword.trim() === "" || phoneNumber.trim() === "" || address.trim() === "" || dateOfBirth === "") {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(401).json({ message: "Password and confirm password do not match." });
    }

    const parsedDateOfBirth = moment(dateOfBirth, "YYYY-MM-DD").toDate();
    if (!moment(parsedDateOfBirth).isValid()) {
        return res.status(400).json({ message: "Invalid date of birth format. Please use YYYY-MM-DD." });
    }

    Customer.findOne({ $or: [{ email }, { phoneNumber }] })
        .then(customer => {
            if (customer) {
                return res.status(401).json({ message: "This user already exists. Try with another email ID or phone number." });
            }

            bcryptjs.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.error("ENCRYPTION ERROR", err);
                    return res.status(500).json({ message: "Server error. Please try again later." });
                }

                Customer.create({
                        name,
                        email,
                        password: hashedPassword,
                        phoneNumber,
                        address,
                        dateOfBirth: parsedDateOfBirth,
                        resToken: null
                    })
                    .then(newCustomer => {
                        res.status(201).json({
                            message: "User registered.",
                            user: {
                                name: newCustomer.name,
                                email: newCustomer.email
                            }
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: "Server error. Please try again later." });
                    });
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Server error. Please try again later." });
        });
};





module.exports = { signin, verifyCustomer, signup, verifyAdmin };