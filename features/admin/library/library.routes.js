const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");

// LIBRARY CREATE
router.post("/", libraryController.registerLibrary);

// LIBRARY GET
router.get("/", libraryController.getLibraries);

// LIBRARY UPDAET
router.patch("/:id", libraryController.updateLibrary);

// LIBRARY DELETE
router.delete("/:id", libraryController.deleteLibrary);

module.exports = router;
