const express = require("express");

const router = express.Router();

const userController = require("./user.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");
// GET USERS
router.get("/", isAdmin, userController.getAllUsers);

// DELETE USER
router.delete("/:id", isAdmin, userController.deleteUser);

// UPDATE USER
router.patch("/:id", isAdmin, userController.updateUser);

module.exports = router;
