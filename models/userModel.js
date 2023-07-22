const mongoose = require("mongoose");
const crypto = require("crypto");

/* User Schema */

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Please provide a username"],
    immutable: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  firstname: {
    type: String,
    required: [true, "Please provide a firstname"],
  },
  lastname: {
    type: String,
    required: [true, "Please provide a lastname"],
  },

  address: {
    type: String,
    required: [true, "Please provide an address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  salt: {
    type: String,
  },
});

/* User Schema Methods */

// get/set user fullname
UserSchema.virtual("fullname")
  .get(function () {
    return this.firstname + " " + this.lastname;
  })
  .set(function (fullname) {
    const parts = fullname.split(" ");
    this.firstname = parts[0];
    this.lastname = parts[1];
  });

UserSchema.methods.hashPassword = function (password) {
  return crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("base64");
};
// pre-save hook to hash password
UserSchema.pre("save", function (next) {
  if (this.password) {
    this.salt = Buffer.from(
      crypto.randomBytes(16).toString("base64"),
      "base64"
    );
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

module.exports = mongoose.model("User", UserSchema);
