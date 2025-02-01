const { default: mongoose } = require("mongoose");

const STATUS_TYPES = {
    QUEUED: "queued",
    DELIVERED: "delivered"
}

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    message: {
        type: String,
        required: true,
        trim: true,
    },
    isCritical: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: Object.values(module.exports.STATUS_TYPES),
        default: STATUS_TYPES.QUEUED
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    deliveredAt: {
        type: Date,
        default: null
    },
});

module.exports = {
    Notification: mongoose.model("Notification", notificationSchema),
    STATUS_TYPES
};