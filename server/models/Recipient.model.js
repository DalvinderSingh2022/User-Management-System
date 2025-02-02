const mongoose = require("mongoose");

const STATUS_TYPES = {
    QUEUED: "queued",
    DELIVERED: "delivered"
}

const recipientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        required: true
    },
    status: {
        type: String,
        enum: Object.values(STATUS_TYPES),
        default: STATUS_TYPES.QUEUED
    },
    deliveredAt: {
        type: Date,
        default: null
    }
});

module.exports = {
    Recipient: mongoose.model("Recipient", recipientSchema),
    STATUS_TYPES
};