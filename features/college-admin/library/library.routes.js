const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");

const isCollegeAdmin = require("../../../shared/middleware/isCollegeAdmin");

const validate = require("../../../shared/middleware/form.validation");

const {
  createLibraryValidationSchema,
  updateLibraryValidationSchema,
} = require("./library.validation");

// ==========================================
// CREATE LIBRARY
// ==========================================

router.post(
  "/create-library",
  isCollegeAdmin,
  validate(createLibraryValidationSchema),
  libraryController.registerLibrary,
);

// ==========================================
// GET ALL LIBRARIES
// ==========================================

router.get("/all-libraries", isCollegeAdmin, libraryController.getLibraries);

// ==========================================
// UPDATE LIBRARY
// ==========================================

router.patch(
  "/update-library/:id",
  isCollegeAdmin,
  validate(updateLibraryValidationSchema),
  libraryController.updateLibrary,
);

// ==========================================
// DELETE LIBRARY
// ==========================================

router.delete(
  "/remove-library/:id",
  isCollegeAdmin,
  libraryController.deleteLibrary,
);

module.exports = router;
