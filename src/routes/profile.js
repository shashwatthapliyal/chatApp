const jwt = require('jsonwebtoken');
const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middleware/auth');
const User = require('../models/user');

const { validateEditProfileData } = require('../utils/validation');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERR : " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) throw new Error("Invalid edit request");

        const _id = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(_id, req.body, { runValidators: true, returnDocument: "after" })
        res.json({ message: "Data updated successfully.....", updatedUser });

    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const newPassword = req?.body?.newPassword;
        const oldPassword = req?.body?.oldPassword;

        const isPasswordCorrect = await user.validatePassword(oldPassword);

        if (!isPasswordCorrect) throw new Error("You entered a wrong password , enter old password to update.....")

        if (oldPassword === newPassword) throw new Error("password can't be same as old one ");

        user["password"] = await user.encryptPassword(newPassword);
        await user.save();

        res.send("password updated successfully.....")
    }
    catch (err) {
        res.send("ERR: " + err.message);
    }
})

module.exports = profileRouter;