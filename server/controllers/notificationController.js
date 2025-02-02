const User = require("../models/User.model");
const { Recipient, STATUS_TYPES } = require("../models/Recipient.model");
const Notification = require("../models/Notification.model");
const mongoose = require("mongoose");

const isAvailable = async (userId) => {
    const user = await User.findById(userId);
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

        if (isCritical) {
            const sender = await User.findById(req.user.userId);

            if (!sender.isAdmin) {
                return res.status(403).json({ message: "Only admins can send critical notifications" });
            }
        }

        const notification = new Notification({
            sender: req.user.userId,
            message
        });
        await notification.save();

        const recipientDocuments = recipients.map(async (user) => {
            const recipient = new Recipient({ user, notification: notification._id });

            if (isCritical || await isAvailable(user)) {
                recipient.status = STATUS_TYPES.DELIVERED;
                recipient.deliveredAt = Date.now();
            } else {
                recipient.status = STATUS_TYPES.QUEUED;
            }
            return recipient.save();
        });
        await Promise.all(recipientDocuments);

        res.status(201).json({ message: "Notification sent successfully", data: notification });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSendNotifications = async (req, res) => {
    const { userId } = req.user;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        if (!await User.exists({ _id: userId })) {
            return res.status(404).json({ message: "User not found" });
        }

        let notifications = await Notification.find({ sender: userId })
            .populate("sender", "name")
            .sort("-sentAt");

        res.status(200).json({ message: "Notifications fetched successfully", data: notifications });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};

exports.getRecipientNotifications = async (req, res) => {
    const { userId } = req.user;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        if (!await User.exists({ _id: userId })) {
            return res.status(404).json({ message: "User not found" });
        }

        const notifications = await Recipient.find({ user: userId });

        const notificationsIds = notifications.map(recipient => recipient.notification);
        const notificationDetails = await Promise.all(
            notificationsIds.map(async (id) => await Notification.findById(id).populate("sender", "name"))
        );

        res.status(200).json({ message: "Notifications fetched successfully", data: notificationDetails });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};
