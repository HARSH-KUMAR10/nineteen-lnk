const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true }, // Links to Task
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["backlog", "started", "completed"],
    default: "backlog",
  },
  attachment_link: { type: String },
  estimated_time: { type: Number, required: true }, // Time in hours
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SubTask = mongoose.model("Subtask", subTaskSchema);

module.exports = SubTask;
