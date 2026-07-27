const express = require("express");

const router = express.Router();

const userController = require("./user.controller");

const isAdmin = require("../../../shared/middleware/isAdmin");

const validate = require("../../../shared/middleware/form.validation");

const {
  updateUserValidationSchema,
  updateProfileValidationSchema,
} = require("./user.validation");

// ==========================================
// USERS
// ==========================================

// GET ALL USERS
router.get("/all-user", isAdmin, userController.getAllUserAccounts);

// DELETE USER
router.delete("/remove-user/:id", isAdmin, userController.deleteUserAccount);

// UPDATE USER
router.patch(
  "/update-user/:id",
  isAdmin,
  validate(updateUserValidationSchema),
  userController.updateUserAccount,
);

// ==========================================
// PROFILE
// ==========================================

// GET LOGGED-IN ADMIN PROFILE
router.get("/profile", isAdmin, userController.getProfile);

// UPDATE LOGGED-IN ADMIN PROFILE
router.patch(
  "/profile",
  isAdmin,
  validate(updateProfileValidationSchema),
  userController.updateProfile,
);

module.exports = router;
