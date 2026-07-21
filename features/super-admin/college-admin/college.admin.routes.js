const express = require("express");

const router = express.Router();

const collegeAdminController = require("./college.admin.controller");

const isSuperAdmin = require("../../../shared/middleware/isSuperAdmin");

const validate = require("../../../shared/middleware/form.validation");

const {
  createCollegeAdminValidationSchema,
} = require("./college.admin.validation");

// CREATE COLLEGE ADMIN
router.post(
  "/create-college-admin",
  isSuperAdmin,
  validate(createCollegeAdminValidationSchema),
  collegeAdminController.createCollegeAdmin,
);

module.exports = router;
