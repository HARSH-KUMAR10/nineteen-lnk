const Task = require("../db/task.model");
const Project = require("../db/project.model");
const logger = require("../utils/logger");
const SubTask = require("../db/subtask.model");
const { cascadeDeleteSubtasks } = require("./subtask.service");

exports.createTask = async (taskData) => {
  try {
    const task = new Task(taskData);
    await task.save();

    logger.info(
      `Task created :: title: ${task.title}, projectId: ${task.projectId}`
    );
    return task;
  } catch (err) {
    logger.error(`Error in createTask :: ${err.message}`);
    throw err;
  }
};

exports.getTasksByProject = async (projectId) => {
  try {
    const tasks = await Task.find({ projectId }).populate("subtasks");

    logger.info(`Tasks fetched for project :: projectId: ${projectId}`);
    return tasks;
  } catch (err) {
    logger.error(`Error in getTasksByProject :: ${err.message}`);
    throw err;
  }
};

exports.updateTask = async (taskId, updateData) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });

    if (!updatedTask) {
      logger.warn(`Task not found for update :: taskId: ${taskId}`);
      return null;
    }

    logger.info(`Task updated :: taskId: ${taskId}`);
    return updatedTask;
  } catch (err) {
    logger.error(`Error in updateTask :: ${err.message}`);
    throw err;
  }
};

exports.deleteTask = async (taskId) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      logger.warn(`Task not found for deletion :: taskId: ${taskId}`);
      return null;
    }
    await cascadeDeleteSubtasks(taskId);
    logger.info(`Task deleted :: taskId: ${taskId}`);
    return deletedTask;
  } catch (err) {
    logger.error(`Error in deleteTask :: ${err.message}`);
    throw err;
  }
};

exports.getTasksWithSubtaskHours = async (projectId) => {
  try {
    // Fetch all tasks for the given project and populate subtasks
    const tasks = await Task.find({ projectId }).populate("subtasks").lean();

    // Prepare result with hours calculation for each task
    const tasksWithHours = await Promise.all(
      tasks.map(async (task) => {
        const subtasksOfTask = await SubTask.find({ taskId: task._id });
        const hoursByStatus = {
          backlog: 0,
          started: 0,
          completed: 0,
        };

        // Sum up hours for each status from subtasks
        for (const subTask of subtasksOfTask) {
          hoursByStatus[subTask.status] += subTask.estimated_time || 0;
        }

        return {
          ...task,
          subtasks: subtasksOfTask,
          totalHours: hoursByStatus, // Include calculated hours for the task
        };
      })
    );

    logger.info(
      `Tasks with subtask hours calculated for projectId: ${projectId}`
    );

    return tasksWithHours;
  } catch (err) {
    logger.error(`Error in getTasksWithSubtaskHours :: ${err.message}`);
    throw err;
  }
};

exports.cascadeDeleteTasks = async (projectId) => {
  try {
    const tasks = await this.getTasksByProject(projectId);
    for (const task of tasks) {
      logger.info(
        `Deleting tasks :: projectId:${projectId}, taskId:${task._id}`
      );
      await this.deleteTask(task._id);
    }
  } catch (err) {
    logger.error(`Error in getTasksWithSubtaskHours :: ${err.message}`);
    throw err;
  }
};
