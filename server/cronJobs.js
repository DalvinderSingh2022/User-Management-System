const cron = require("node-cron");
const { Notification, STATUS_TYPES } = require("./models/Notification.model");
const User = require("./models/User.model");

const isAvailable = async (user) => {
    const currentTime = new Date();
    const startTime = new Date();
    const endTime = new Date();

    const [startHour, startMinute] = user.availability.start.split(':');
    const [endHour, endMinute] = user.availability.end.split(':');

    startTime.setHours(startHour, startMinute, 0);
    endTime.setHours(endHour, endMinute, 0);

    return currentTime >= startTime && currentTime <= endTime;
};

cron.schedule("* * * * *", async () => {
    try {
        const queuedNotifications = await Notification.find({ recipients: { $elemMatch: { status: STATUS_TYPES.QUEUED } } });

        for (const notification of queuedNotifications) {
            for (const recipient of notification.recipients) {
                const user = await User.findById(recipient.user);

                if (user && isAvailable(user)) {
                    recipient.status = STATUS_TYPES.DELIVERED;
                    recipient.deliveredAt = new Date();
                }
            }

            await notification.save();
        }
    } catch (error) {
        console.error("Error processing notifications:", error);
    }
});

module.exports = isAvailable;