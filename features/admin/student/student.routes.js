const express = require("express");

const router = express.Router();

const studentController = require("./student.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");

const validate = require("../../../shared/middleware/form.validation");
const {
  createStudentValidationSchema,
  updateStudentValidationSchema,
} = require("./student.validation");
// GET ALL STUDENTS
router.get("/all-student", isAdmin, studentController.getAllStudents);

// GET SINGLE STUDENT
router.get("/single-student/:id", isAdmin, studentController.getSingleStudent);

// CREATE STUDENT
router.post(
  "/create-student",
  isAdmin,
  validate(createStudentValidationSchema),
  studentController.createStudent,
);

// UPDATE STUDENT
router.patch(
  "/update-student/:id",
  isAdmin,
  validate(updateStudentValidationSchema),
  studentController.updateStudent,
);

// DELETE STUDENT
router.delete("/remove-student/:id", isAdmin, studentController.deleteStudent);

module.exports = router;
