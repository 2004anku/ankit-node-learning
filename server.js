const cors = require("cors");
const express = require("express");

const connectDB = require("./config/db");
const libraryRoutes = require("./features/super-admin/library/library.routes");
const userRoutes = require("./features/admin/useraccount/user.routes");
const bookRoutes = require("./features/admin/book/book.routes");
const authRoutes = require("./features/admin/auth/auth.routes");
const issueRoutes = require("./features/admin/book-circulation/book.circulation.routes");
const studentRoutes = require("./features/admin/student/student.routes");
const studentRoute = require("./features/student/student/student.routes");
const dashboardRoutes = require("./features/admin/dashboard/dashboard.routes");
const collegeRoutes = require("./features/super-admin/college/college.routes");
const superAdminAuthRoutes = require("./features/super-admin/auth/auth.routes");
const libraryAdminRoutes = require("./features/super-admin/library-admin/library.admin.routes");
const app = express();
require("dotenv").config();

// DATABASE CONNECTION
console.log("MONGO_URI =", process.env.MONGO_URI);
connectDB();

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
app.use("/api/1/super-admin/libraries", libraryRoutes);
app.use("/api/1/admin/users", userRoutes);
app.use("/api/1/admin/books", bookRoutes);
app.use("/api/1/admin/book-circulation", issueRoutes);
app.use("/api/1/admin/student", studentRoutes);
app.use("/api/1/students", studentRoute);
app.use("/api/1/admin/dashboard", dashboardRoutes);
app.use("/api/1/super-admin/auth", superAdminAuthRoutes);
app.use("/api/1/super-admin/colleges", collegeRoutes);
app.use("/api/1/super-admin/library-admin", libraryAdminRoutes);
// SERVER
app.listen(process.env.PORT, () => {
  console.log("Server  running on port 3001 🚀");
});
