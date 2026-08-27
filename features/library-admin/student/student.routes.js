const express = require("express");

const router = express.Router();

const studentController = require("./student.controller");
const isLibraryAdmin = require("../../../shared/middleware/isLibraryAdmin");

const validate = require("../../../shared/middleware/form.validation");
const {
  createStudentValidationSchema,
  updateStudentValidationSchema,
} = require("./student.validation");
// GET ALL STUDENTS
router.get("/all-student", isLibraryAdmin, studentController.getAllStudents);

// GET SINGLE STUDENT
router.get(
  "/single-student/:id",
  isLibraryAdmin,
  studentController.getSingleStudent,
);

// CREATE STUDENT
router.post(
  "/create-student",
  isLibraryAdmin,
  validate(createStudentValidationSchema),
  studentController.createStudent,
);

// UPDATE STUDENT
router.patch(
  "/update-student/:id",
  isLibraryAdmin,
  validate(updateStudentValidationSchema),
  studentController.updateStudent,
);

// DELETE STUDENT
router.delete(
  "/remove-student/:id",
  isLibraryAdmin,
  studentController.deleteStudent,
);
// get profile
router.get("/profile/:id", isLibraryAdmin, studentController.getStudentProfile);
// restore student
router.patch(
  "/restore-student/:id",
  isLibraryAdmin,
  studentController.restoreStudent,
);

router.get(
  "/archived-students",
  isLibraryAdmin,
  studentController.getArchivedStudents,
);

module.exports = router;
