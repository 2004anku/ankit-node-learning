const express = require("express");

const router = express.Router();

const userController = require("./user.controller");

const isLibraryAdmin = require("../../../shared/middleware/isLibraryAdmin");

const validate = require("../../../shared/middleware/form.validation");

const { updateProfileValidationSchema } = require("./user.validation");

// ==========================================
// LIBRARIAN PROFILE
// ==========================================

// GET LOGGED-IN LIBRARIAN PROFILE
router.get("/profile", isLibraryAdmin, userController.getProfile);

// UPDATE LOGGED-IN LIBRARIAN PROFILE
router.patch(
  "/profile",
  isLibraryAdmin,
  validate(updateProfileValidationSchema),
  userController.updateProfile,
);

module.exports = router;
