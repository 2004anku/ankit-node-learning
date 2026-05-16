const express = require("express");

const router = express.Router();

const userController = require("./user.controller");

// CREATE USER
router.post("/register", userController.createUser);

// GET USERS
router.get("/all", userController.getAllUsers);

// DELETE USER
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
