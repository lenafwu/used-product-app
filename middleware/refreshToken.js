require("dotenv").config();
const jwt = require("jsonwebtoken");
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const RefreshToken = require("../models/refreshTokenModel");

const refreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ success: false, message: "No token." });
  const refresh_Token = cookies.jwt;

  // check if refresh token is in DB
  try {
    const foundToken = await RefreshToken.findOne({ token: refresh_Token });

    jwt.verify(refresh_Token, REFRESH_TOKEN_SECRET, (err, decodedToken) => {
      if (err)
        return res
          .status(401)
          .json({ success: false, message: "Token is invalid." });

      // send new access token if refresh token is valid
      const payload = {
        _id: decodedToken._id,
        username: decodedToken.username,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30s",
      });

      return res.json({ success: true, accessToken });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

module.exports = refreshToken;
