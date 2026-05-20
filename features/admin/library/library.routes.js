const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");
// LIBRARY CREATE
router.post("/", isAdmin, libraryController.registerLibrary);

// LIBRARY GET
router.get("/", isAdmin, libraryController.getLibraries);

// LIBRARY UPDAET
router.patch("/:id", isAdmin, libraryController.updateLibrary);

// LIBRARY DELETE
router.delete("/:id", isAdmin, libraryController.deleteLibrary);

module.exports = router;
