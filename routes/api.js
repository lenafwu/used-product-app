const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.get("/profile", authenticateToken, profileController.getUserProfile);

router.post("/profile", authenticateToken, profileController.updateUserProfile);
module.exports = router;
