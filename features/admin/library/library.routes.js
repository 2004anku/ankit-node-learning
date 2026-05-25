const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");

const validate = require("../../../shared/middleware/form.validation");
const {
  createLibraryValidationSchema,
  updateLibraryValidationSchema,
} = require("./library.validation");

// LIBRARY CREATE
router.post(
  "/create-library",
  isAdmin,
  validate(createLibraryValidationSchema),
  libraryController.registerLibrary,
);

// LIBRARY GET
router.get("/all-libraries", isAdmin, libraryController.getLibraries);

// LIBRARY UPDAET
router.patch(
  "/update-library/:id",
  isAdmin,
  validate(updateLibraryValidationSchema),
  libraryController.updateLibrary,
);

// LIBRARY DELETE
router.delete("/remove-library/:id", isAdmin, libraryController.deleteLibrary);

module.exports = router;
