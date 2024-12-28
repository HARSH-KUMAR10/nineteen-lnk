const TaskService = require("../services/task.service");
const logger = require("../utils/logger");

exports.createTask = async (req, res) => {
  try {
    const task = await TaskService.createTask(req.body);
    res.status(201).json({
      statusCode: 201,
      message: "Task created successfully.",
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Error creating task.",
      error: err.message,
    });
  }
};

exports.getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await TaskService.getTasksByProject(projectId);
    res.status(200).json({
      statusCode: 200,
      message: "Tasks fetched successfully.",
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Error fetching tasks.",
      error: err.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const updatedTask = await TaskService.updateTask(taskId, req.body);

    if (!updatedTask) {
      return res.status(404).json({
        statusCode: 404,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Task updated successfully.",
      data: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Error updating task.",
      error: err.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await TaskService.deleteTask(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        statusCode: 404,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Task deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Error deleting task.",
      error: err.message,
    });
  }
};

exports.getProjectTasksWithSubtaskHours = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate projectId
    if (!projectId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    // Fetch tasks with subtask hours
    const tasksWithHours = await TaskService.getTasksWithSubtaskHours(
      projectId
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Tasks with subtask hours fetched successfully",
      data: tasksWithHours,
    });
  } catch (err) {
    logger.error(
      `Error in getProjectTasksWithSubtaskHours API :: ${err.message}`
    );
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};
