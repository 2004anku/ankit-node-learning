const express = require("express");

const router = express.Router();

const studentController = require("./student.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");
// CREATE STUDENT
router.post("/", isAdmin, studentController.createStudent);

// GET ALL STUDENTS
router.get("/", isAdmin, studentController.getAllStudents);

// GET SINGLE STUDENT
router.get("/:id", isAdmin, studentController.getSingleStudent);

// UPDATE STUDENT
router.patch("/", isAdmin, studentController.updateStudent);

// DELETE STUDENT
router.delete("/", isAdmin, studentController.deleteStudent);

module.exports = router;
