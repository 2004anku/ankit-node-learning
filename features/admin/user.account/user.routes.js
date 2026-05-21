const express = require("express");

const router = express.Router();

const userController = require("./user.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");
const validate = require("./../../../shared/middleware/form.validation");
const userValidationSchema = require("./user.validation");
// GET USERS
router.get("/all-user", isAdmin, userController.getAllUserAccounts);

// DELETE USER
router.delete("/remove-user/:id", isAdmin, userController.deleteUserAccount);

// UPDATE USER
router.patch(
  "/update-user/:id",
  isAdmin,
  validate(userValidationSchema),
  userController.updateUserAccount,
);

module.exports = router;
