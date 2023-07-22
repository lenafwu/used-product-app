require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const passport = require("passport");
const User = require("../models/userModel");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = () => {
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    })
  );
};
