require("dotenv").config();
const mongoose = require("mongoose");
const mongoDB_URL = process.env.MONGO_DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("======> MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
