const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../db/user.model"); // Assuming the User model is already defined
const { info, warn, error } = require("../utils/logger");

const fn = "user.service.js";

// Helper function to generate JWT token
const generateToken = (userId, email) => {
  console.log(process.env.JWT_SECRET);
  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  return token;
};

const login = async (email, password) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      warn(
        `[ERROR] [${fn}-login] User not found for email :: email: ${email}`,
        { email }
      );
      return null;
    }

    // 2. Check if password matches
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      warn(
        `[ERROR] [${fn}-login] Invalid password for email :: email:${email}`,
        { email }
      );
      return null;
    }

    // 3. Generate JWT token
    const token = generateToken(user._id, user.email);
    info(
      `[INFO] [${fn}-login] JWT generated for userId :: userId: ${user._id}`,
      { userId: user._id }
    );
    return { token, _id: user._id, email: user.email };
  } catch (error) {
    error(`[ERROR] [${fn}-login] Error :: ${error.message}`, {
      error: err.message,
    });
    return null;
  }
};

// Fetch all users (just email for login page)
const getAllUsers = async () => {
  try {
    const users = await User.find({}, "email"); // Fetch only the email
    info("users fetched", { userCount: users.length });
    return users;
  } catch (err) {
    error("error fetching users from DB", { error: err.message });
    return null;
  }
};

module.exports = {
  login,
  getAllUsers,
};
