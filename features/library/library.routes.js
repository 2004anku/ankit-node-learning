const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");

// LIBRARY CREATE
router.post("/register", libraryController.registerLibrary);

// LIBRARY GET
router.get("/all", libraryController.getLibraries);

// LIBRARY UPDAET
router.patch("/update/:id", libraryController.updateLibrary);

// LIBRARY DELETE
router.delete("/delete/:id", libraryController.deleteLibrary);

module.exports = router;
