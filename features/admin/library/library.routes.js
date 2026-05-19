const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");
const admin = require("./../shared/middleware/isAdmin");

// LIBRARY CREATE
router.post("/", admin, libraryController.registerLibrary);

// LIBRARY GET
router.get("/", admin, libraryController.getLibraries);

// LIBRARY UPDAET
router.patch("/:id", admin, libraryController.updateLibrary);

// LIBRARY DELETE
router.delete("/:id", admin, libraryController.deleteLibrary);

module.exports = router;
