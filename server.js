const cors = require("cors");
const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./features/library-admin/auth/auth.routes");
const userRoutes = require("./features/library-admin/profile/user.routes");
const bookRoutes = require("./features/library-admin/book/book.routes");
const issueRoutes = require("./features/library-admin/book-circulation/book.circulation.routes");
const studentRoutes = require("./features/library-admin/student/student.routes");
const dashboardRoutes = require("./features/library-admin/dashboard/dashboard.routes");

const studentRoute = require("./features/student/student/student.routes");

const superAdminAuthRoutes = require("./features/super-admin/auth/auth.routes");
const collegeRoutes = require("./features/super-admin/college/college.routes");
const collegeAdminRoutes = require("./features/super-admin/college-admin/college.admin.routes");

const libraryRoutes = require("./features/college-admin/library/library.routes");
const libraryAdminRoutes = require("./features/college-admin/library-admin/library.admin.routes");
const collegeAdminAuthRoutes = require("./features/college-admin/auth/auth.routes");
const dataTransferRoutes = require("./features/library-admin/data-transfer/data.transfer.routes");
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

// Library Admin
app.use("/api/1/library-admin/auth", authRoutes);
app.use("/api/1/library-admin/users", userRoutes);
app.use("/api/1/library-admin/books", bookRoutes);
app.use("/api/1/library-admin/book-circulation", issueRoutes);
app.use("/api/1/library-admin/student", studentRoutes);
app.use("/api/1/library-admin/dashboard", dashboardRoutes);
app.use("/api/1/library-admin/data-transfer", dataTransferRoutes);

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
