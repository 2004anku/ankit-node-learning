const cors = require("cors");
const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./features/admin/auth/auth.routes");
const userRoutes = require("./features/admin/useraccount/user.routes");
const bookRoutes = require("./features/admin/book/book.routes");
const issueRoutes = require("./features/admin/book-circulation/book.circulation.routes");
const studentRoutes = require("./features/admin/student/student.routes");
const dashboardRoutes = require("./features/admin/dashboard/dashboard.routes");
const profileRoutes = require("./features/admin/profile/profile.routes");

const studentRoute = require("./features/student/student/student.routes");

const superAdminAuthRoutes = require("./features/super-admin/auth/auth.routes");
const collegeRoutes = require("./features/super-admin/college/college.routes");
const collegeAdminRoutes = require("./features/super-admin/college-admin/college.admin.routes");

const libraryRoutes = require("./features/college-admin/library/library.routes");
const libraryAdminRoutes = require("./features/college-admin/library-admin/library.admin.routes");
const collegeAdminAuthRoutes = require("./features/college-admin/auth/auth.routes");

const app = express();

/* ------------------------- DATABASE CONNECTION ------------------------- */

// Connect to MongoDB before starting the application
connectDB();

/* ----------------------------- MIDDLEWARE ------------------------------ */

app.use(
  cors({
    origin: "http://localhost:3000", // Next.js frontend
    credentials: true, // Allow cookies/auth headers
  }),
);

app.use(express.json()); // Parse incoming JSON requests

/* ------------------------------- ROUTES ------------------------------- */

// Admin
app.use("/api/1/admin/auth", authRoutes);
app.use("/api/1/admin/users", userRoutes);
app.use("/api/1/admin/books", bookRoutes);
app.use("/api/1/admin/book-circulation", issueRoutes);
app.use("/api/1/admin/student", studentRoutes);
app.use("/api/1/admin/dashboard", dashboardRoutes);

// Student
app.use("/api/1/students", studentRoute);

// Super Admin
app.use("/api/1/super-admin/auth", superAdminAuthRoutes);
app.use("/api/1/super-admin/colleges", collegeRoutes);
app.use("/api/1/super-admin/college-admin", collegeAdminRoutes);

// College Admin
app.use("/api/1/college-admin/auth", collegeAdminAuthRoutes);
app.use("/api/1/college-admin/libraries", libraryRoutes);
app.use("/api/1/college-admin/library-admin", libraryAdminRoutes);

/* ------------------------------- SERVER ------------------------------- */

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
