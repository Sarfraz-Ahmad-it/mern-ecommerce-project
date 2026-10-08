const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check required fields
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Normalize input
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validate name
    if (!normalizedName) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Check if another user is already using this email
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.userId },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already in use",
      });
    }

    // Find and update the logged-in user's profile
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: normalizedName,
        email: normalizedEmail,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};