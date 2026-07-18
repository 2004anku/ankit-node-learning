const express = require("express");

const router = express.Router();

const libraryController = require("./library.controller");

const isSuperAdmin = require("../../../shared/middleware/isSuperAdmin");

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
  isSuperAdmin,
  validate(createLibraryValidationSchema),
  libraryController.registerLibrary,
);

// ==========================================
// GET ALL LIBRARIES
// ==========================================

router.get("/all-libraries", isSuperAdmin, libraryController.getLibraries);

// ==========================================
// UPDATE LIBRARY
// ==========================================

router.patch(
  "/update-library/:id",
  isSuperAdmin,
  validate(updateLibraryValidationSchema),
  libraryController.updateLibrary,
);

// ==========================================
// DELETE LIBRARY
// ==========================================

router.delete(
  "/remove-library/:id",
  isSuperAdmin,
  libraryController.deleteLibrary,
);

module.exports = router;
