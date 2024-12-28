const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["backlog", "started", "completed"],
    default: "backlog",
  },
  attachment_link: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

projectSchema.pre("remove", async function (next) {
  const Project = this;
  await mongoose.model("Task").deleteMany({ projectId: Project._id });
  next();
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
