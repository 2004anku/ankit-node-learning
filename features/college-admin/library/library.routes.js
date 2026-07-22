const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");

const isCollegeAdmin = require("../../../shared/middleware/isCollegeAdmin");

const validate = require("../../../shared/middleware/form.validation");
const auth = require("../../../shared/middleware/auth");

const {
  createLibraryValidationSchema,
  updateLibraryValidationSchema,
} = require("./library.validation");

// ==========================================
// CREATE LIBRARY
// ==========================================

router.post(
  "/create-library",
  auth,
  isCollegeAdmin,
  validate(createLibraryValidationSchema),
  libraryController.registerLibrary,
);

// ==========================================
// GET ALL LIBRARIES
// ==========================================

router.get(
  "/all-libraries",
  auth,
  isCollegeAdmin,
  libraryController.getLibraries,
);

// ==========================================
// UPDATE LIBRARY
// ==========================================

router.patch(
  "/update-library/:id",
  auth,
  isCollegeAdmin,
  validate(updateLibraryValidationSchema),
  libraryController.updateLibrary,
);

// ==========================================
// DELETE LIBRARY
// ==========================================

router.delete(
  "/remove-library/:id",
  auth,
  isCollegeAdmin,
  libraryController.deleteLibrary,
);

module.exports = router;
