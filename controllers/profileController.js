const User = require("../models/userModel");

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        created: user.created,
      },
    });
  } catch (err) {
    console.log("err when getting user profile");
    return res.status(400).json({
      success: false,
      message: getErrorMessage(err),
    });
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { email, phone, firstname, lastname, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        email,
        phone,
        firstname,
        lastname,
        address,
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        address: updatedUser.address,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        created: updatedUser.created,
      },
    });
  } catch (err) {
    console.log("err when updating user profile");
    return res.status(400).json({
      success: false,
      message: getErrorMessage(err),
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
