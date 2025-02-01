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
        start: { type: Date, required: true },
        end: { type: Date, required: true },
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("User", userSchema)