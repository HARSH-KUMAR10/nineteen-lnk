const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  }, // Links to Project
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
  subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subtask" }],
});

taskSchema.pre("remove", async function (next) {
  const Task = this;
  await mongoose.model("Subtask").deleteMany({ taskId: Task._id });
  next();
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
