const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide question title"],
  },
  description: {
    type: String,
    required: [true, "Please provide question description"],
  },
  answer: {
    type: String,
  },
});

const AdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: [true, "Please provide a start date"],
  },
  expiryDate: {
    type: Date,
    required: [true, "Please provide an expiry date"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  questions: [QuestionSchema],
});

module.exports = mongoose.model("Ad", AdSchema);
