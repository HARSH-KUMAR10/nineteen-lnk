const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    logger.warn("Authorization token missing.");
    return res
      .status(401)
      .json({ statusCode: 401, message: "Authentication required." });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.log(err);
    logger.error(`Invalid token :: ${err.message}`);
    return res
      .status(403)
      .json({ statusCode: 403, message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
