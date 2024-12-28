const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

userSchema.pre("remove", async function (next) {
  const User = this;
  await mongoose.model("Project").deleteMany({ userId: User._id });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
