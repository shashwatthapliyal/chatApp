const express = require('express');
const userAuth = require('../middleware/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills ";

// get all the pending connection requests from the logged in user
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        })
            .select("fromUserId")
            .populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about"])

        res.json({
            message: "Data fetched successfully....",
            connectionRequest,
        })
    }
    catch (err) {
        res.status(400).send("ERR : " + err.message);
    }

})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id,
                    status: "accepted",
                },
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted",
                }
            ]
        })
            // the user can also be from toUserId so we have to ref it also
            .populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about"])
            .populate("toUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about"]);

        const data = connectionRequest.map((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({
            message: "Data fetched successfully",
            data,
        })
    }


    catch (err) {
        res.status(400).send("ERR : " + err.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;


        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUser._id,
                },
                {
                    toUserId: loggedInUser._id,
                }
            ]
        }).select(["fromUserId", "toUserId"]);
        const hideUsersFromFeed = new Set();

        connectionRequest.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        })


        const users = await User.find({
            $and: [
                {
                    _id: { $nin: Array.from(hideUsersFromFeed) }
                },
                {
                    _id: { $ne: loggedInUser._id }
                }
            ]
        }).select(USER_SAFE_DATA).skip((page - 1) * limit).limit(limit);

        // res.send(connectionRequest)
        res.send(users);
    }

    catch (err) {
        res.status(400).send("ERR : " + err.message);
    }
})

module.exports = userRouter;





