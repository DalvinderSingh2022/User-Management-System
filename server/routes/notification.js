const express = require("express");
const { sendNotification, getSendNotifications, getRecipientNotifications } = require("../controllers/notificationController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/send", auth, getSendNotifications);
router.get("/recipient", auth, getRecipientNotifications);
router.post("/", auth, sendNotification);

module.exports = router;