const express = require("express");
const { sendNotification, getNotifications } = require("../controllers/notificationController");
const auth = require("../middleware/auth");
const router = express.Router();

router.route("/notification").get(auth, getNotifications).post(auth, sendNotification);

module.exports = router;