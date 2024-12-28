const subtaskService = require("../services/subtask.service");
const logger = require("../utils/logger");

// Create a new subtask
exports.createSubtask = async (req, res) => {
  try {
    const subtask = await subtaskService.createSubtask(req.body);
    return res.status(201).json({
      statusCode: 201,
      message: "Subtask created successfully",
      data: subtask,
    });
  } catch (err) {
    logger.error(`Error in createSubtask API :: ${err.message}`);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

// Get all subtasks by taskId
exports.getSubtasksByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;
    const subtasks = await subtaskService.getSubtasksByTaskId(taskId);
    return res.status(200).json({
      statusCode: 200,
      message: "Subtasks fetched successfully",
      data: subtasks,
    });
  } catch (err) {
    logger.error(`Error in getSubtasksByTaskId API :: ${err.message}`);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

// Update a subtask
exports.updateSubtask = async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const subtask = await subtaskService.updateSubtask(subtaskId, req.body);
    if (!subtask) {
      return res.status(404).json({
        statusCode: 404,
        message: "Subtask not found",
        data: null,
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Subtask updated successfully",
      data: subtask,
    });
  } catch (err) {
    logger.error(`Error in updateSubtask API :: ${err.message}`);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

// Delete a subtask
exports.deleteSubtask = async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const subtask = await subtaskService.deleteSubtask(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        statusCode: 404,
        message: "Subtask not found",
        data: null,
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Subtask deleted successfully",
      data: subtask,
    });
  } catch (err) {
    logger.error(`Error in deleteSubtask API :: ${err.message}`);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};
