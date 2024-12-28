// utils/logger.js

const log = (level, action, data = null) => {
  const timestamp = new Date().toISOString();

  let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${action}`;
  if (data) {
    logMessage += ` :: ${JSON.stringify(data)}`;
  }

  console[level](logMessage);
};

module.exports = {
  info: (action, data) => log("info", action, data),
  warn: (action, data) => log("warn", action, data),
  error: (action, data) => log("error", action, data),
};
