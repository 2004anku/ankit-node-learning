const express = require("express");

const router = express.Router();

const userController = require("./user.controller");

// CREATE USER
router.post("/register", userController.createUser);

// GET USERS
router.get("/all", userController.getAllUsers);

// UPDATE USER
router.put("/update/:id", userController.updateUser);

// DELETE USER
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
