const express = require("express");

const router = express.Router();

const libraryAdminController = require("./library.admin.controller");

const validate = require("../../../shared/middleware/form.validation");
const isCollegeAdmin = require("../../../shared/middleware/isCollegeAdmin");
const auth = require("../../../shared/middleware/auth");

const {
  createLibraryAdminValidationSchema,
  updateLibraryAdminValidationSchema,
} = require("./library.admin.validaiton");

// ==========================================
// CREATE LIBRARY ADMIN
// ==========================================

router.post(
  "/create-library-admin",
  auth,
  isCollegeAdmin,
  validate(createLibraryAdminValidationSchema),
  libraryAdminController.createLibraryAdmin,
);

// ==========================================
// GET ALL LIBRARY ADMINS
// ==========================================

router.get(
  "/all-library-admins",
  auth,
  isCollegeAdmin,
  libraryAdminController.getAllLibraryAdmins,
);

// ==========================================
// GET SINGLE LIBRARY ADMIN
// ==========================================

router.get(
  "/:id",
  isCollegeAdmin,
  auth,
  libraryAdminController.getSingleLibraryAdmin,
);

// ==========================================
// UPDATE LIBRARY ADMIN
// ==========================================

router.patch(
  "/update-library-admin/:id",
  auth,
  isCollegeAdmin,
  validate(updateLibraryAdminValidationSchema),
  libraryAdminController.updateLibraryAdmin,
);

// ==========================================
// DELETE LIBRARY ADMIN
// ==========================================

router.delete(
  "/remove-library-admin/:id",
  auth,
  isCollegeAdmin,
  libraryAdminController.deleteLibraryAdmin,
);

module.exports = router;
