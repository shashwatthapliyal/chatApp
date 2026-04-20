const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user')

authRouter.post("/signup", async (req, res) => {
    console.log(req.body);
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
        const token = user.getJWT();
        res.cookie("token", token);
        res.json({
            message: "Account Created Scuuessfully",
            user,
        })


    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        // console.log(emailId, password);


        if (!validator.isEmail(emailId)) throw new Error("Email is not valid. Please enter a valid email id")

        const user = await User.findOne({ emailId });

        if (user === null) throw new Error("Invalid Credentials")

        const isPasswordValid = await user.validatePassword(password);

        // console.log(isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).send("Invalid Credentials")
        }

        else {
            // Create a JWT token.
            const token = user.getJWT();

            res.cookie("token", token);
            // console.log(token);

            // console.log(user)
            // Add the token to cookies and send the response back to user.
            return res.json({
                message: "login successful",
                user,
            })
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }

})


authRouter.post("/logout", async (req, res) => {
    console.log("hello")
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })

    res.send("logged out....");
})


module.exports = authRouter;


