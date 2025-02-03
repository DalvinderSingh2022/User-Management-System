const User = require("../models/User.model");
const mongoose = require("mongoose");

exports.getUser = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile fetched successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.user.userId;
    const { name, mobileNumber, bio, availability } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !await User.exists({ _id: userId })) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (bio || bio === '') updateData.bio = bio;
    if (availability) updateData.availability = availability;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "At least one field is required" });
    }

    if (availability && (!availability.start || !availability.end)) {
        return res.status(400).json({ message: "Both start and end of availability are required" });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
