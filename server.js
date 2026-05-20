const express = require("express");

const connectDB = require("./config/db");

const libraryRoutes = require("./features/admin/library/library.routes");
const userRoutes = require("./features/admin/user/user.routes");
const bookRoutes = require("./features/admin/book/book.routes");
const authRoutes = require("./features/admin/auth/auth.routes");
const issueRoutes = require("./features/admin/book.circulation/issue.routes");
const studentRoutes = require("./features/admin/student/student.routes");

const app = express();
require("dotenv").config();

// DATABASE CONNECTION
connectDB();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use("/admin/auth", authRoutes);
app.use("/admin/libraries", libraryRoutes);
app.use("/admin/users", userRoutes);
app.use("/admin/books", bookRoutes);
app.use("/admin/book.issue", issueRoutes);
app.use("/admin/student", studentRoutes);

// DEFAULT ROUTE (only for check)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Library Management System API Running 🚀",
  });
});

// SERVER
app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000 🚀");
});
