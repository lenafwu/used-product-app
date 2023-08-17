const User = require("../models/userModel");
const Ad = require("../models/adModel");

const getAllAds = async (req, res, next) => {
  // get all ads
  try {
    const ads = await Ad.find().sort({ _id: -1 }).populate("postedBy");

    // const updatedAds = [];

    // for (let ad of ads) {
    //   const user = await User.findById(ad.postedBy);

    //   // Convert Mongoose document to plain object as document is immutable
    //   // FIXED: this works but I don't feel it's the best way to do it
    //   // populate(): handle document references across collections
    //   // let adObject = ad.toObject();
    //   // adObject.postedBy = `${user.fullname}`;
    //   // updatedAds.push(adObject);
    // }
    return res.json({
      success: true,
      ads,
    });
  } catch (err) {
    console.log("err when getting all ads" + err);
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const getAdById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Ad id is required",
      });
    }

    const ad = await Ad.findById(req.params.id).populate("postedBy");
    return res.json({
      success: true,
      ad,
    });
  } catch (err) {
    console.log("err when getting ad by id");
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const createAd = async (req, res, next) => {
  const userId = req.user._id;
  const { title, description, price, startDate, expiryDate, isActive } =
    req.body;
  const ad = new Ad({
    title,
    description,
    postedBy: userId,
    price,
    startDate,
    expiryDate,
    isActive,
  });
  try {
    const newAd = await ad.save();
    return res.json({
      success: true,
      message: "Ad created successfully",
      ad: newAd,
    });
  } catch (err) {
    console.log("err when creating ad");
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const updateAd = async (req, res, next) => {
  try {
    const adId = req.params.id;

    if (!adId) {
      return res.status(400).json({
        success: false,
        message: "Ad id is required",
      });
    }
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(400).json({
        success: false,
        message: "Ad not found",
      });
    }

    if (ad.postedBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to edit this ad",
      });
    }

    const updatedAd = await Ad.findByIdAndUpdate(adId, req.body, { new: true });
    return res.json({
      success: true,
      message: "Ad updated successfully",
      ad: updatedAd,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const deleteAd = async (req, res, next) => {
  const adId = req.params.id;
  try {
    const ad = await Ad.findById(adId);
    if (ad.postedBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this ad",
      });
    }

    await Ad.findByIdAndDelete(adId);

    return res.json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (err) {
    console.log("err when deleting ad");
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const createQuestion = async (req, res, next) => {
  const adId = req.params.id;
  const { title, description } = req.body;
  try {
    const ad = await Ad.findById(adId);
    ad.questions.push({ title, description });
    await ad.save();
    return res.json({
      success: true,
      message: "Question created successfully",
      ad,
    });
  } catch (err) {
    console.log("err when creating question");
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const getQuestions = async (req, res, next) => {
  const adId = req.params.id;
  try {
    const ad = await Ad.findById(adId);
    return res.json({
      success: true,
      questions: ad.questions,
    });
  } catch (err) {
    console.log("err when getting questions");
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const createAnswer = async (req, res, next) => {
  const userId = req.user._id;
  const adId = req.params.id;
  const questionId = req.params.questionId;
  const { answer } = req.body;

  try {
    const ad = await Ad.findById(adId);
    const question = ad.questions.id(questionId);

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question not found",
      });
    }
    if (ad.postedBy.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to answer this question",
      });
    }
    if (question.answer) {
      return res.status(400).json({
        success: false,
        message: "Question already answered",
      });
    }

    question.answer = answer;
    await ad.save();
    return res.json({
      success: true,
      message: "Answer created successfully",
      questions: ad.questions,
    });
  } catch (err) {
    console.log("err when creating answer");
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const editAnswer = async (req, res, next) => {
  const userId = req.user._id;
  const adId = req.params.id;
  const questionId = req.params.questionId;
  const { answer } = req.body;

  try {
    const ad = await Ad.findById(adId);
    const question = ad.questions.id(questionId);

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question not found",
      });
    }
    if (ad.postedBy.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to edit this answer",
      });
    }
    if (!question.answer) {
      return res.status(400).json({
        success: false,
        message: "Question not answered yet",
      });
    }

    question.answer = answer;
    await ad.save();
    return res.json({
      success: true,
      message: "Answer updated successfully",
      questions: ad.questions,
    });
  } catch (err) {
    console.log("err when updating answer");
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const deleteAnswer = async (req, res, next) => {
  const userId = req.user._id;
  const adId = req.params.id;
  const questionId = req.params.questionId;
  try {
    const ad = await Ad.findById(adId);
    const question = ad.questions.id(questionId);

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question not found",
      });
    }
    if (ad.postedBy.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this answer",
      });
    }
    if (!question.answer) {
      return res.status(400).json({
        success: false,
        message: "Question not answered yet",
      });
    }

    question.answer = undefined;
    await ad.save();
    return res.json({
      success: true,
      message: "Answer deleted successfully",
      questions: ad.questions,
    });
  } catch (err) {
    console.log("err when deleting answer");
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

module.exports = {
  getAllAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  createQuestion,
  getQuestions,
  createAnswer,
  editAnswer,
  deleteAnswer,
};
