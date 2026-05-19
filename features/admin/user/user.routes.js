const express = require("express");

const router = express.Router();

const userController = require("./user.controller");
const auth = require("../../../middleware/auth.middleware");

// GET USERS
router.get("/", auth, userController.getAllUsers);

// DELETE USER
router.delete("/:id", auth, userController.deleteUser);

// UPDATE USER
router.patch("/:id", auth, userController.updateUser);

module.exports = router;
