const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: String,
    bio: String,
    availability: {
        start: { type: String, default: "00:00" },
        end: { type: String, default: "23:59" },
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("User", userSchema);