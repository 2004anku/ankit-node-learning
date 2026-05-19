const express = require("express");

const router = express.Router();

const studentController = require("./student.controller");
const admin = require("../shared/middleware/isAdmin");

// CREATE STUDENT
router.post("/", admin, studentController.createStudent);

// GET ALL STUDENTS
router.get("/", admin, studentController.getAllStudents);

// GET SINGLE STUDENT
router.get("/:id", admin, studentController.getSingleStudent);

// UPDATE STUDENT
router.patch("/", admin, studentController.updateStudent);

// DELETE STUDENT
router.delete("/", admin, studentController.deleteStudent);

module.exports = router;
