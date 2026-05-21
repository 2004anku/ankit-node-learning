const express = require("express");

const router = express.Router();

const studentController = require("./student.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");

const validate = require("../../../shared/middleware/form.validation");
const studentValidationSchema = require("./student.validation");

// GET ALL STUDENTS
router.get("/all-student", isAdmin, studentController.getAllStudents);

// GET SINGLE STUDENT
router.get("/single-student/:id", isAdmin, studentController.getSingleStudent);

// CREATE STUDENT
router.post(
  "/create-student",
  isAdmin,
  validate(studentValidationSchema),
  studentController.createStudent,
);

// UPDATE STUDENT
router.patch(
  "/update-student/:id",
  isAdmin,
  validate(studentValidationSchema),
  studentController.updateStudent,
);

// DELETE STUDENT
router.delete("/remove-student/:id", isAdmin, studentController.deleteStudent);

module.exports = router;
