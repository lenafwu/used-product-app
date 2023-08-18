const express = require("express");
const router = express.Router();

const Ad = require("../models/adModel");
const adController = require("../controllers/adController");
const authenticateToken = require("../middleware/authenticateToken");

// get all ads
router.get("/", adController.getAllAds);

// get ads by user id
router.get("/user", authenticateToken, adController.getAdsByUserId);

// get ad by id
router.get("/:id", adController.getAdById);

// create ad (by logged in user)
router.post("/", authenticateToken, adController.createAd);

// update ad by id (by logged in user)
router.put("/:id", authenticateToken, adController.updateAd);

// delete ad by id (by logged in user)
router.delete("/:id", authenticateToken, adController.deleteAd);

// create question to an ad
router.post("/:id/questions", adController.createQuestion);

// get all questions to an ad
router.get("/:id/questions", adController.getQuestions);

// create answer to a question (by logged in user)
router.post(
  "/:id/questions/:questionId/answer",
  authenticateToken,
  adController.createAnswer
);

// edit answer to a question (by logged in user)
router.put(
  "/:id/questions/:questionId/answer",
  authenticateToken,
  adController.editAnswer
);

// delete answer to a question (by logged in user)
router.delete(
  "/:id/questions/:questionId/answer",
  authenticateToken,
  adController.deleteAnswer
);

module.exports = router;
