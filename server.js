const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");
const UserRouter = require("./routes/user.route");
const ProjectRouter = require("./routes/project.route");
const taskRouter = require("./routes/task.route");
const subtaskRouter = require("./routes/subtask.route");
const cors = require("cors");

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Sample Route
app.use("/", express.static("dist"));
app.get("/api", (req, res) => {
  res.send("API is running...");
});

// Nested Routes
app.use("/api/user", UserRouter);
app.use("/api/project", ProjectRouter);
app.use("/api/task", taskRouter);
app.use("/api/subtasks", subtaskRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
