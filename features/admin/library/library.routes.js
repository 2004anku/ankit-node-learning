const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");
const auth = require("../../../middleware/auth.middleware");
const isAdmin = require("../shared/middleware/isAdmin.middleware");

// LIBRARY CREATE
router.post("/", auth, isAdmin, libraryController.registerLibrary);

// LIBRARY GET
router.get("/", auth, libraryController.getLibraries);

// LIBRARY UPDAET
router.patch("/:id", auth, isAdmin, libraryController.updateLibrary);

// LIBRARY DELETE
router.delete("/:id", auth, isAdmin, libraryController.deleteLibrary);

module.exports = router;
