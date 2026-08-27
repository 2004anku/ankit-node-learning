const express = require("express");

const router = express.Router();

const { getDashboardStats, searchStudents } = require("./dashboard.controller");

const isLibraryAdmin = require("../../../shared/middleware/isLibraryAdmin");

// ==========================================
// DASHBOARD
// ==========================================

// Dashboard Statistics
router.get("/stats", isLibraryAdmin, getDashboardStats);

// ==========================================
// SEARCH
// ==========================================

// Search Students
router.get("/search-students", isLibraryAdmin, searchStudents);

module.exports = router;
