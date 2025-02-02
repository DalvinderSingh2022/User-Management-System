const express = require("express");
const { getUser, updateUser, getAllUsers, getProfile } = require("../controllers/userController");
const auth = require("../middleware/auth");
const router = express.Router();

router.put("/profile", auth, updateUser);
router.get("/:id", auth, getUser);
router.get("/", auth, getAllUsers);

module.exports = router;