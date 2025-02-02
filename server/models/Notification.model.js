const mongoose = require("mongoose");

const STATUS_TYPES = {
    QUEUED: "queued",
    DELIVERED: "delivered"
}

const recipientSchema = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
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
};

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipients: [recipientSchema],
    message: {
        type: String,
        required: true,
        trim: true,
    },
    isCritical: {
        type: Boolean,
        default: false
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    Notification: mongoose.model("Notification", notificationSchema),
    STATUS_TYPES
};
