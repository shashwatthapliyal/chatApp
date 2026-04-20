const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "pending", "accepted", "rejected", "interested"],
            message: "{VALUE} is incorrect status type"
        }
    }
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
    // Check if fromUser and toUser are same
    if (this.toUserId.equals(this.fromUserId)) {
        throw new Error("Can't send connection request to yourself");
    }
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);