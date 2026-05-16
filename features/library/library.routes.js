const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");

router.post("/register", libraryController.registerLibrary);
router.get("/all", libraryController.getLibraries);

module.exports = router;
