const validateLoginInput = (email, password) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  return null;
};

module.exports = {
  validateLoginInput,
};
