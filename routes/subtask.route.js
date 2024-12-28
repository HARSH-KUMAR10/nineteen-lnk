const express = require("express");
const subtaskController = require("../controllers/subtask.controller");
const authenticateToken = require("../middleware/auth.middleware");
const subtaskRouter = express.Router();

subtaskRouter.post("/", authenticateToken, subtaskController.createSubtask); // Create a subtask
subtaskRouter.get(
  "/:taskId",
  authenticateToken,
  subtaskController.getSubtasksByTaskId
); // Get subtasks by taskId
subtaskRouter.put(
  "/:subtaskId",
  authenticateToken,
  subtaskController.updateSubtask
); // Update a subtask
subtaskRouter.delete(
  "/:subtaskId",
  authenticateToken,
  subtaskController.deleteSubtask
); // Delete a subtask

module.exports = subtaskRouter;
