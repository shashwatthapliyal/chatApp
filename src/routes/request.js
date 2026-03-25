const express = require('express');
const requestRouter = express.Router();

const userAuth = require('../middleware/auth');

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    console.log("Sending connection request......");

    const user = req?.user;

    res.send(user.firstName + " sent a connectionn request");
})

requestRouter.post("/request/send/interested/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;

        const toUserId = req.params.toUserId;
    }

    catch (err) {
        res.status(400).send("ERR:" + err.message);
    }
})

module.exports = requestRouter;