const express = require("express");
const UserRouter = express.Router();
const { loginUser, getUsers } = require("../controllers/user.controller");

// POST /login
UserRouter.post("/login", loginUser);
UserRouter.get("/all", getUsers);

module.exports = UserRouter;
