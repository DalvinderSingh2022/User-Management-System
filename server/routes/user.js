const express = require("express");
const { getUser, updateUser, getAllUsers, getProfile } = require("../controllers/userController");
const auth = require("../middleware/auth");
const router = express.Router();

router.route("/profile").get(auth, getUser).put(auth, updateUser);
router.get("/", getAllUsers);
router.get("/:id", getProfile);

module.exports = router;