const Project = require("../db/project.model");
const SubTask = require("../db/subtask.model");
const Task = require("../db/task.model");
const logger = require("../utils/logger");
const { cascadeDeleteTasks } = require("./task.service");

exports.createProject = async (
  userId,
  title,
  description,
  status,
  attachment_link
) => {
  try {
    const project = new Project({
      userId,
      title,
      description,
      status,
      attachment_link,
    });
    const newProject = await project.save();
    logger.info(`Project created successfully :: ${newProject._id}`);
    return newProject;
  } catch (err) {
    logger.error(`Error in createProject :: ${err.message}`);
    throw err;
  }
};

exports.getProjectsByUserId = async (userId) => {
  try {
    const projects = await Project.find({ userId }).populate("tasks");
    logger.info(`Projects fetched for user :: userId: ${userId}`);
    return projects;
  } catch (err) {
    logger.error(`Error in getProjectsByUserId :: ${err.message}`);
    throw err;
  }
};

exports.getProjectById = async (projectId) => {
  try {
    const project = await Project.findById(projectId).populate("tasks");
    logger.info(`Project fetched by ID :: projectId: ${projectId}`);
    return project;
  } catch (err) {
    logger.error(`Error in getProjectById :: ${err.message}`);
    throw err;
  }
};

exports.updateProject = async (
  projectId,
  title,
  description,
  status,
  attachment_link
) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { title, description, status, attachment_link },
      { new: true }
    ).populate("tasks");
    logger.info(`Project updated :: projectId: ${projectId}`);
    return updatedProject;
  } catch (err) {
    logger.error(`Error in updateProject :: ${err.message}`);
    throw err;
  }
};

exports.deleteProject = async (projectId) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    logger.info(`Project deleted :: projectId: ${projectId}`);
    await cascadeDeleteTasks(projectId);
    return deletedProject;
  } catch (err) {
    logger.error(`Error in deleteProject :: ${err.message}`);
    throw err;
  }
};

exports.getCumulativeHours = async (projectId) => {
  try {
    // Get the project with all tasks populated
    const project = await Project.findById(projectId).populate("tasks");

    // Calculate the cumulative hours for all tasks in the project
    let totalHours = { backlog: 0, started: 0, completed: 0 };
    for (let task of project.tasks) {
      for (let subTask of task.subTasks) {
        totalHours[subTask.status] += subTask.estimated_time;
      }
    }

    logger.info(
      `Cumulative hours fetched for project :: projectId: ${projectId}`
    );
    return totalHours;
  } catch (err) {
    logger.error(`Error in getCumulativeHours :: ${err.message}`);
    throw err;
  }
};

exports.getCumulativeHoursByUser = async (userId) => {
  try {
    // Fetch all projects for the given user and populate tasks and subtasks
    const projects = await Project.find({ userId }).populate({
      path: "tasks",
      populate: { path: "subTasks" }, // Populate subTasks inside tasks
    });

    if (!projects.length) {
      logger.warn(`No projects found for user :: userId: ${userId}`);
      return [];
    }

    // Prepare response with individual project details and their cumulative hours
    const projectDetails = await Promise.all(
      projects.map(async (project) => {
        const tasksOfProject = await Task.find({ projectId: project._id });
        let totalHours = { backlog: 0, started: 0, completed: 0 };
        let tasksToReturn = [];
        // Calculate total hours for each project
        for (let task of tasksOfProject) {
          const subTasksOfTask = await SubTask.find({ taskId: task._id });
          for (let subTask of subTasksOfTask) {
            totalHours[subTask.status] += subTask.estimated_time;
          }
          tasksToReturn.push({ ...task._doc, subtasks: subTasksOfTask });
        }

        logger.info(
          `Cumulative hours calculated for project :: projectId: ${project._id}`
        );

        return {
          projectId: project._id,
          title: project.title,
          description: project.description,
          status: project.status,
          attachment_link: project.attachment_link,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          totalHours, // Include cumulative hours
          tasks: tasksToReturn,
        };
      })
    );

    logger.info(
      `Cumulative hours fetched for all projects of user :: userId: ${userId}`
    );
    return projectDetails.sort((a, b) => {
      const sumA = a.totalHours.backlog + a.totalHours.started;
      const sumB = b.totalHours.backlog + b.totalHours.started;
      return sumB - sumA; // Descending order
    });
  } catch (err) {
    logger.error(`Error in getCumulativeHoursByUser :: ${err.message}`);
    throw err;
  }
};
