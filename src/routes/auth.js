const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

const validateSignUpData = require('../utils/validation');
const User = require('../models/user')

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) throw new Error("Email is not valid. Please enter a valid email id")

        const user = await User.findOne({ emailId });

        if (user === null) throw new Error("User is not present")

        const isPasswordValid = await user.validatePassword(password);

        // console.log(isPasswordValid);

        if (!isPasswordValid) return res.send("Invalid Credentials");

        else {
            // Create a JWT token.
            const token = user.getJWT();

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


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })

    res.send("logged out....");
})


module.exports = authRouter;