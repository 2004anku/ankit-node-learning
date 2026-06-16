const cors = require("cors");
const express = require("express");

const connectDB = require("./config/db");

const libraryRoutes = require("./features/admin/library/library.routes");
const userRoutes = require("./features/admin/useraccount/user.routes");
const bookRoutes = require("./features/admin/book/book.routes");
const authRoutes = require("./features/admin/auth/auth.routes");
const issueRoutes = require("./features/admin/book-circulation/book.circulation.routes");
const studentRoutes = require("./features/admin/student/student.routes");
const studentRoute = require("./features/student/student/student.routes");
const dashboardRoutes = require("./features/admin/dashboard/dashboard.routes");
const app = express();
require("dotenv").config();

// DATABASE CONNECTION
connectDB();

// MIDDLEWARE
// MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:3000", // frontend url
    credentials: true,
  }),
);

app.use(express.json());

// ROUTES
app.use("/api/1/admin/auth", authRoutes);
app.use("/api/1/admin/libraries", libraryRoutes);
app.use("/api/1/admin/users", userRoutes);
app.use("/api/1/admin/books", bookRoutes);
app.use("/api/1/admin/book-circulation", issueRoutes);
app.use("/api/1/admin/student", studentRoutes);
app.use("/api/1/students", studentRoute);
app.use("/api/1/admin/dashboard", dashboardRoutes);

// SERVER
app.listen(process.env.PORT, () => {
  console.log("Server  running on port 3001 🚀");
});
