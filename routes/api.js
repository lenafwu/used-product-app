const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/authenticateToken");
const refreshToken = require("../middleware/refreshToken");

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.get("/profile", authenticateToken, profileController.getUserProfile);

router.post("/profile", authenticateToken, profileController.updateUserProfile);

router.get("/refresh", refreshToken);

module.exports = router;
