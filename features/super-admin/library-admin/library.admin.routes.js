const express = require("express");

const router = express.Router();

const libraryAdminController = require("./library.admin.controller");

const validate = require("../../../shared/middleware/form.validation");

const isSuperAdmin = require("../../../shared/middleware/isSuperAdmin");

const {
  createLibraryAdminValidationSchema,
  updateLibraryAdminValidationSchema,
} = require("./library.admin.validaiton");

// ==========================================
// CREATE LIBRARY ADMIN
// ==========================================

router.post(
  "/create-library-admin",
  isSuperAdmin,
  validate(createLibraryAdminValidationSchema),
  libraryAdminController.createLibraryAdmin,
);

// ==========================================
// GET ALL LIBRARY ADMINS
// ==========================================

router.get(
  "/all-library-admins",
  isSuperAdmin,
  libraryAdminController.getAllLibraryAdmins,
);

// ==========================================
// GET SINGLE LIBRARY ADMIN
// ==========================================

router.get("/:id", isSuperAdmin, libraryAdminController.getSingleLibraryAdmin);

// ==========================================
// UPDATE LIBRARY ADMIN
// ==========================================

router.patch(
  "/update-library-admin/:id",
  isSuperAdmin,
  validate(updateLibraryAdminValidationSchema),
  libraryAdminController.updateLibraryAdmin,
);

// ==========================================
// DELETE LIBRARY ADMIN
// ==========================================

router.delete(
  "/remove-library-admin/:id",
  isSuperAdmin,
  libraryAdminController.deleteLibraryAdmin,
);

module.exports = router;
