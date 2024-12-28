const Subtask = require("../db/subtask.model");
const logger = require("../utils/logger");

// Create a new subtask
exports.createSubtask = async (subtaskData) => {
  try {
    const subtask = await Subtask.create(subtaskData);
    logger.info(`Subtask created :: ${JSON.stringify(subtask)}`);
    return subtask;
  } catch (err) {
    logger.error(`Error in createSubtask :: ${err.message}`);
    throw err;
  }
};

// Get all subtasks by taskId
exports.getSubtasksByTaskId = async (taskId) => {
  try {
    const subtasks = await Subtask.find({ taskId });
    logger.info(`Subtasks fetched for taskId :: ${taskId}`);
    return subtasks;
  } catch (err) {
    logger.error(`Error in getSubtasksByTaskId :: ${err.message}`);
    throw err;
  }
};

// Update a subtask
exports.updateSubtask = async (subtaskId, updatedData) => {
  try {
    const subtask = await Subtask.findByIdAndUpdate(subtaskId, updatedData, {
      new: true,
    });
    if (!subtask) {
      logger.info(`Subtask not found :: subtaskId: ${subtaskId}`);
      return null;
    }
    logger.info(`Subtask updated :: ${JSON.stringify(subtask)}`);
    return subtask;
  } catch (err) {
    logger.error(`Error in updateSubtask :: ${err.message}`);
    throw err;
  }
};

// Delete a subtask
exports.deleteSubtask = async (subtaskId) => {
  try {
    const subtask = await Subtask.findByIdAndDelete(subtaskId);
    if (!subtask) {
      logger.info(`Subtask not found for deletion :: subtaskId: ${subtaskId}`);
      return null;
    }
    logger.info(`Subtask deleted :: subtaskId: ${subtaskId}`);
    return subtask;
  } catch (err) {
    logger.error(`Error in deleteSubtask :: ${err.message}`);
    throw err;
  }
};

exports.cascadeDeleteSubtasks = async (taskId) => {
  try {
    const subtasks = await this.getSubtasksByTaskId(taskId);
    for (const subtask of subtasks) {
      logger.info(
        `Deleting subtasks :: taskId:${taskId}, subtaskId:${subtask._id}`
      );
      await this.deleteSubtask(subtask._id);
    }
  } catch (err) {
    logger.error(`Error in getTasksWithSubtaskHours :: ${err.message}`);
    throw err;
  }
};
