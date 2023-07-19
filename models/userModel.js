const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* User Schema */

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: [true, "Please provide a date of birth"],
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
  },
  password: {
      type: String,
      required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

/* User Schema Methods */

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.hash_password);
};

// TODO: add JWT authentication

module.exports = mongoose.model("User", UserSchema);
