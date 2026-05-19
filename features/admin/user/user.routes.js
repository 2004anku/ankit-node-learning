const express = require("express");

const router = express.Router();

const userController = require("./user.controller");
const admin = require("./../shared/middleware/isAdmin");

// GET USERS
router.get("/", admin, userController.getAllUsers);

// DELETE USER
router.delete("/:id", admin, userController.deleteUser);

// UPDATE USER
router.patch("/:id", admin, userController.updateUser);

module.exports = router;
