const express = require("express");
const taskController = require("../controllers/task.controller");
const authenticateToken = require("../middleware/auth.middleware");

const taskRouter = express.Router();

taskRouter.post("/", authenticateToken, taskController.createTask);
taskRouter.get(
  "/:projectId",
  authenticateToken,
  taskController.getTasksByProject
);
taskRouter.put("/:taskId", authenticateToken, taskController.updateTask);
taskRouter.delete("/:taskId", authenticateToken, taskController.deleteTask);

// Route to get all tasks with subtask hours calculation
taskRouter.get(
  "/:projectId/tasks-with-hours",
  authenticateToken,
  taskController.getProjectTasksWithSubtaskHours
);

module.exports = taskRouter;
