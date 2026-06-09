const express = require("express");

const router = express.Router();

const { getDashboardStats } = require("./dashboard.controller");

const isAdmin = require("../../../shared/middleware/isAdmin");

router.get("/", isAdmin, getDashboardStats);

module.exports = router;
