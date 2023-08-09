const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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

  // create JWTs
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30s",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  // save refreshToken in DB
  const newRefreshToken = new RefreshToken({
    token: refreshToken,
    user: user._id,
  });
  await newRefreshToken.save();

  // note: to improve security, store JWTs in cookies with httpOnly flag set to true
  // instead of storing in localStorage or memory
  // to set cookies in Chrome, must set sameSite to "none" and secure to true
  // FIXME: cannot set cookies on browsers, ok on Postman
  console.log("===> Setting cookies");
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  return res.json({
    success: true,
    accessToken: accessToken,
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
      expiresIn: "30s",
    });

    return res.json({
      success: true,
      accessToken: token,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(err),
    });
  }
};

const logout = (req, res, next) => {
  // note: to log out is to clear cookie and delete refresh token from DB

  // on client, also delete the access token
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content to send back
  const refresh_Token = cookies.jwt;

  // check if refresh token is in DB
  RefreshToken.deleteOne({ token: refresh_Token }); // if not in DB, user is already logged out, will not cause error here

  // clear cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none" });
  return res.sendStatus(204);
};
module.exports = {
  signin,
  signup,
  logout,
};
