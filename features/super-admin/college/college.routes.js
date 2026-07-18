const express = require("express");

const router = express.Router();

const collegeController = require("./college.controller");

const validate = require("../../../shared/middleware/form.validation");
const isSuperAdmin = require("../../../shared/middleware/isSuperAdmin");

const {
  createCollegeValidationSchema,
  updateCollegeValidationSchema,
} = require("./college.validation");

// ==========================================
// CREATE COLLEGE
// ==========================================

router.post(
  "/create-college",
  isSuperAdmin,
  validate(createCollegeValidationSchema),
  collegeController.registerCollege,
);

// ==========================================
// GET ALL COLLEGES
// ==========================================

router.get("/all-college", isSuperAdmin, collegeController.getAllColleges);

// ==========================================
// GET SINGLE COLLEGE
// ==========================================

router.get("/:id", isSuperAdmin, collegeController.getSingleCollege);

// ==========================================
// UPDATE COLLEGE
// ==========================================

router.patch(
  "/:id",
  isSuperAdmin,
  validate(updateCollegeValidationSchema),
  collegeController.updateCollege,
);

// ==========================================
// DELETE COLLEGE
// ==========================================

router.delete("/:id", isSuperAdmin, collegeController.deleteCollege);

module.exports = router;
