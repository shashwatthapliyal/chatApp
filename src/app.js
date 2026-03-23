const express = require('express');
const connectDB = require("./config/database.js")
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');


const User = require('./models/user.js');
const validateSignUpData = require('./utils/validation.js');
const userAuth = require('./middleware/auth.js')

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    // console.log(req.body);
    try {
        // Validation of data........
        validateSignUpData(req);

        // Encrypt the password.......
        const { firstName, lastName, emailId, age, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        // console.log(passwordHash, password);

        const user = new User({
            firstName,
            lastName,
            age,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("account created successfully");
    }
    catch (err) {
        res.status(400).send("error saving the user :  " + err.message);
    }
})

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) throw new Error("Email is not valid. Please enter a valid email id")

        const user = await User.findOne({ emailId });

        if (user === null) throw new Error("User is not present")

        const isPasswordValid = await bcrypt.compare(password, user.password);

        // console.log(isPasswordValid);

        if (!isPasswordValid) return res.send("Invalid Credentials");

        else {
            // Create a JWT token.
            const token = jwt.sign({ _id: user._id }, "secretKey", {
                expiresIn: "1h"
            });
            res.cookie("token", token);
            // console.log(token);

            // Add the token to cookies and send the response back to user.



            return res.send("Login successful");
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }

})

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERR : " + err.message);
    }
})


app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    console.log("Sending connection request......");

    const { user } = req;

    res.send(user.firstName + " sent a connectionn request");
})


connectDB()
    .then(() => {
        app.listen(3000, () => console.log("listening....."));
        console.log("DB connection established")

    })
    .catch(() => console.log("Can't connect to DB"))

