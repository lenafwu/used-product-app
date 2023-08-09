const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json({ success: false, message: "No token." });
  
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; // Remove 'Bearer ' prefix

  if (!token) {
    // If token is not present, user is unauthorized
    return res.status(401).json({
      success: false,
      message: "No token.",
    });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      // If token is invalid, user is unauthorized
      return res.status(403).json({
        success: false,
        message: "Token is invalid.",
      });
    }

    // If token is valid, attach the decoded user information to the request object
    req.user = decodedToken;
    next();
  });
};

module.exports = authenticateToken;
