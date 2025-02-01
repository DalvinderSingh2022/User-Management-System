const User = require("../models/User.model");
const { Notification, STATUS_TYPES } = require("../models/Notification.model");
const mongoose = require("mongoose");

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile fetched successfully", data: user });
    } catch (error) {
        res.status(400).json({ message: "Error fetching profile", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { name, mobileNumber, bio, availability } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !await User.exists({ _id: userId })) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    if (!name && !mobileNumber && !bio && !availability) {
        return res.status(400).json({ message: "At least one field is required" });
    }

    if (availability && (!availability.start || !availability.end)) {
        return res.status(400).json({ message: "Both start and end of availability are required" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (bio) updateData.bio = bio;
    if (availability) updateData.availability = availability;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        res.json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

const isAvailable = (user) => {
    const currentTime = new Date();
    const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const [startHours, startMinutes] = user.availability.start.split(":").map(Number);
    const [endHours, endMinutes] = user.availability.end.split(":").map(Number);

    const startTimeInMinutes = startHours * 60 + startMinutes;
    let endTimeInMinutes = endHours * 60 + endMinutes;

    if (endTimeInMinutes === 0) endTimeInMinutes = 24 * 60;

    if (startTimeInMinutes <= endTimeInMinutes) {
        return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
    }
};

exports.sendNotification = async (req, res) => {
    const { recipients, message, isCritical } = req.body;

    if (!recipients || !message || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ message: 'Recipients and message are required' });
    }

    try {
        const validationPromises = recipients.map(async (id) => {
            const isValid = mongoose.Types.ObjectId.isValid(id);
            const exists = isValid ? await User.exists({ _id: id }) : false;
            return { id, isValid, exists };
        });
        const results = await Promise.all(validationPromises);

        const invalidRecipients = results
            .filter(result => !(result.isValid && result.exists))
            .map(result => result.id);

        if (invalidRecipients.length > 0) {
            return res.status(400).json({ message: `Invalid recipient Ids: ${invalidRecipients.join(', ')}` });
        }

        const notification = new Notification({
            sender: req.user.userId,
            message
        });

        if (isCritical) {
            var sender = await User.findById(req.user.userId);

            if (!sender.isAdmin) {
                return res.status(403).json({ message: "Only admins can send critical notifications" });
            }
        }

        const validUsers = await User.find({ _id: { $in: recipients } });

        const validRecipients = validUsers.map(user => {
            const recipient = { user: user._id };

            if ((isCritical && sender.isAdmin) || isAvailable(user)) {
                recipient.status = STATUS_TYPES.DELIVERED;
                recipient.deliveredAt = Date.now();
            } else {
                recipient.status = STATUS_TYPES.QUEUED;
            }
            return recipient;
        })
        notification.recipients = validRecipients;

        await notification.save();
        res.status(201).json({ message: "Notification sent successfully", data: notification });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getNotifications = async (req, res) => {
    const { userId } = req.user;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        if (!await User.exists({ _id: userId })) {
            return res.status(404).json({ message: "User not found" });
        }

        const notifications = await Notification.find({ recipients: { user: userId } })
            .populate("sender", "name")
            .sort("-sentAt");

        res.json({ message: "Notifications fetched successfully", data: notifications });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};