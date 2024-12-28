const express = require("express");
const projectController = require("../controllers/project.controller");
const authenticateToken = require("../middleware/auth.middleware");

const ProjectRouter = express.Router();

// Create a new project
ProjectRouter.post("/", authenticateToken, projectController.createProject);

// Get all projects for a user
ProjectRouter.get(
  "/all/:userId",
  authenticateToken,
  projectController.getProjectsByUserId
);

// Get a single project by ID
ProjectRouter.get(
  "/:projectId",
  //   authenticateToken,
  projectController.getProjectById
);

// Update a project
ProjectRouter.put(
  "/:projectId",
  authenticateToken,
  projectController.updateProject
);

// Delete a project
ProjectRouter.delete(
  "/:projectId",
  authenticateToken,
  projectController.deleteProject
);

// Get cumulative hours for all tasks in a project
ProjectRouter.get(
  "/:projectId/cumulative-hours",
  authenticateToken,
  projectController.getCumulativeHours
);

// Add route for fetching cumulative hours for all projects of a user
ProjectRouter.get(
  "/cumulative-hours/:userId",
  authenticateToken,
  projectController.getCumulativeHoursByUser
);
module.exports = ProjectRouter;
