const express = require("express");

const router = express.Router();

const profileController = require("./profile.controller");

const isAdmin = require("../../../shared/middleware/isAdmin");

// GET MY PROFILE
router.get("/", isAdmin, profileController.getMyProfile);

module.exports = router;
