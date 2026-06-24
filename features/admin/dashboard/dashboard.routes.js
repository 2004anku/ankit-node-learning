const express = require("express");

const { getDashboardStats, searchStudents } = require("./dashboard.controller");

const router = express.Router();

router.get("/stats", getDashboardStats);

router.get("/search-students", searchStudents);

module.exports = router;
