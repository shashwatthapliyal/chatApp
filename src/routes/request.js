const express = require('express');
const requestRouter = express.Router();

const userAuth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest.js');
const User = require('../models/user.js');
const { message } = require('prompt');

// for status : interested and ignored
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) return res.status(400).json({
            message: "Invalid status type:" + status,
        })

        // Check if there is existence connection request.....
        const existenceConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId,
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId,
                }
            ],
        }
        )
        if (existenceConnectionRequest) throw new Error("Already sent a request.....")

        // Check if the toUser exists in database.....
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "User not found",
            })
        }


        // Create a new instance and save the user.....
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data,
        })
    }

    catch (err) {
        res.status(400).send("ERR:" + err.message);
    }
})

// for status : accepted and rejected
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;

        const allowedStatus = ["accepted", "rejected"];

        if (!allowedStatus.includes(status)) return res.status(400).json({
            message: "Status not allowed....."
        })

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })

        if (!connectionRequest) return res.status(404).json({
            message: "Connection request not found",
        })

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
             message: "Connection request " + status,
            data,
        })

    }

    catch (err) {
        res.status(400).send("ERR : " + err.message);
    }


})



module.exports = requestRouter;