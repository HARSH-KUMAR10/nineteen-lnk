const { login, getAllUsers } = require("../services/user.service");
const { validateLoginInput } = require("../utils/validators");
const { info, warn, error } = require("../utils/logger");

let fn = "user.controller.js";
const loginUser = async (req, res) => {
  try {
    // 1. Validate request body
    const { email, password } = req.body;
    const validationError = validateLoginInput(email, password);
    if (validationError) {
      warn(
        `[ERROR] [${fn}-loginUser] Validation Failed :: ${validationError}`,
        { email }
      );
      return res.status(400).json({
        statusCode: 400,
        message: validationError,
        data: null,
      });
    }

    // 2. Authenticate user
    const result = await login(email, password);
    if (!result) {
      warn(
        `[ERROR] [${fn}-loginUser] Authentication Failed :: Invalid credentials`,
        { email }
      );

      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
        data: null,
      });
    }

    // 3. Successful login, send token
    info(`[INFO] [${fn}-loginUser] Login Success :: User authenticated`, {
      email,
    });
    return res.status(200).json({
      statusCode: 200,
      message: "Login successful",
      data: { token: result.token, _id: result._id, email: result.email },
    });
  } catch (error) {
    error(`[ERROR] [${fn}-loginUser] Error :: ${error.message}`, {
      error: error.message,
    });
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No users found",
        data: null,
      });
    }

    info("users fetched successfully", { userCount: users.length });
    return res.status(200).json({
      statusCode: 200,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    error("error fetching users", { error: err.message });
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = {
  loginUser,
  getUsers,
};
