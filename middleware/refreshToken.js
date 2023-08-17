require("dotenv").config();
const jwt = require("jsonwebtoken");
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const RefreshToken = require("../models/refreshTokenModel");
const User = require("../models/userModel");

const refreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  console.log("I received cookies: ", cookies);
  if (!cookies?.jwt)
    return res.status(401).json({ success: false, message: "No token." });
  const refresh_Token = cookies.jwt;

  // check if refresh token is in DB
  try {
    const foundToken = await RefreshToken.findOne({ token: refresh_Token });

    jwt.verify(
      refresh_Token,
      REFRESH_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err)
          return res
            .status(401)
            .json({ success: false, message: "Token is invalid." });
        // check if user matches
        const foundUser = await User.findById(decodedToken._id);
        if (!foundUser || foundUser._id != decodedToken._id)
          return res.sendStatus(401);

        // send new access token if refresh token is valid
        const payload = {
          _id: decodedToken._id,
          username: decodedToken.username,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "30s",
        });

        return res.json({
          success: true,
          user: foundUser.username,
          accessToken,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

module.exports = refreshToken;
