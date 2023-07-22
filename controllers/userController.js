const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require("passport");

// error message
const getErrorMessage = (err) => {
  console.log("===> Error: " + err);
  let message = "";
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = "Username already exists";
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

// helper function for guard purposes
// const requireAuth = (req, res, next) => {
//   // check if the user is logged in
//   passport.authenticate("tokencheck", { session: false }, (err, user, info) => {
//     if (err)
//       return res.status(401).json({
//         success: false,
//         message: getErrorMessage(err),
//       });
//     if (info)
//       return res.status(401).json({
//         success: false,
//         message: info.message,
//       });
//     req.payload = payload;
//     next();
//   })(req, res, next);
// };

const signin = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found.",
    });
  }
  // verify password
  const validPassword = user.authenticate(req.body.password);
  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password.",
    });
  }

  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.json({
    success: true,
    token: "Bearer " + token,
  });
};

const signup = async (req, res, next) => {
  console.log(req.body);

  let user = new User(req.body);
  try {
    let result = await user.save();
    const payload = {
      _id: result._id,
      username: result.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(err),
    });
  }
};

module.exports = {
  signin,
  signup,
};
