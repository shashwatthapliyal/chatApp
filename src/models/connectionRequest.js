const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "pending", "accepted", "rejected"],
            messagea: "{VALUE} is incorrect status type"
        }
    }
})

module.exports = mongoose.module("connectionRequest", connectionRequestSchema);