const express = require("express");
const { getProfile, updateProfile, sendNotification, getNotifications } = require("../controllers/userController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/send-notification", auth, sendNotification);
router.get("/notifications", auth, getNotifications);

module.exports = router;