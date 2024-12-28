const projectService = require("../services/project.service");
const logger = require("../utils/logger");

exports.createProject = async (req, res) => {
  try {
    const { userId, title, description, status, attachment_link } = req.body;
    logger.info(`Creating project :: userId: ${userId}, title: ${title}`);
    const newProject = await projectService.createProject(
      userId,
      title,
      description,
      status,
      attachment_link
    );
    res
      .status(201)
      .json({ statusCode: 201, message: "Project created", data: newProject });
  } catch (err) {
    console.log(err);
    logger.error(`Error creating project :: ${err.message}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};

exports.getProjectsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(`Fetching projects for user :: userId: ${userId}`);
    const projects = await projectService.getProjectsByUserId(userId);
    res
      .status(200)
      .json({ statusCode: 200, message: "Projects fetched", data: projects });
  } catch (err) {
    logger.error(`Error fetching projects :: ${err.message}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    logger.info(`Fetching project by ID :: projectId: ${projectId}`);
    const project = await projectService.getProjectById(projectId);
    res
      .status(200)
      .json({ statusCode: 200, message: "Project fetched", data: project });
  } catch (err) {
    logger.error(`Error fetching project by ID :: ${err.message}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, attachment_link } = req.body;
    logger.info(`Updating project :: projectId: ${projectId}`);
    const updatedProject = await projectService.updateProject(
      projectId,
      title,
      description,
      status,
      attachment_link
    );
    res.status(200).json({
      statusCode: 200,
      message: "Project updated",
      data: updatedProject,
    });
  } catch (err) {
    logger.error(`Error updating project :: ${err.message}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    logger.info(`Deleting project :: projectId: ${projectId}`);
    const deletedProject = await projectService.deleteProject(projectId);
    res.status(200).json({
      statusCode: 200,
      message: "Project deleted",
      data: deletedProject,
    });
  } catch (err) {
    logger.error(`Error deleting project :: ${err.message}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};

exports.getCumulativeHours = async (req, res) => {
  try {
    const { projectId } = req.params;
    logger.info(
      `Fetching cumulative hours for project :: projectId: ${projectId}`
    );
    const cumulativeHours = await projectService.getCumulativeHours(projectId);
    res.status(200).json({
      statusCode: 200,
      message: "Cumulative hours fetched",
      data: cumulativeHours,
    });
  } catch (err) {
    logger.error(`Error fetching cumulative hours :: ${err.message}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};

exports.getCumulativeHoursByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const projectDetails = await projectService.getCumulativeHoursByUser(
      userId
    );

    res.status(200).json({
      statusCode: 200,
      message: "Cumulative hours fetched successfully.",
      data: projectDetails,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Error fetching cumulative hours.",
      error: err.message,
    });
  }
};
