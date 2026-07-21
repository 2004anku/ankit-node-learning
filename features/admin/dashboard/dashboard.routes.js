const express = require("express");

const router = express.Router();

const { getDashboardStats, searchStudents } = require("./dashboard.controller");

const isAdmin = require("../../../shared/middleware/isAdmin");

// ==========================================
// DASHBOARD
// ==========================================

// Dashboard Statistics
router.get("/stats", isAdmin, getDashboardStats);

// ==========================================
// SEARCH
// ==========================================

// Search Students
router.get("/search-students", isAdmin, searchStudents);

module.exports = router;
