const express = require("express");

const router = express.Router();

const studentController = require("./student.controller");

const isStudent = require("../_shared/middleware/isStudent");

const formValidation = require("../../../shared/middleware/form.validation");

const loginValidation = require("./student.validation");

const { studentLogin } = require("../auth/auth.controller");

const {
  requestBookIssue,
  returnBookRequest,
  getMyBooks,
} = require("../book-circulation/book.request.controller");

// LOGIN STUDENT
router.post("/login", formValidation(loginValidation), studentLogin);

// GET ALL BOOKS
router.get("/books", isStudent, studentController.getAllBooks);

// GET MY ISSUED BOOKS
router.get("/my-books", isStudent, getMyBooks);

// REQUEST BOOK
router.post("/request-book", isStudent, requestBookIssue);

// RETURN BOOK REQUEST
router.patch("/return-request/:issueId", isStudent, returnBookRequest);

// GET MY PROFILE
router.get("/profile", isStudent, studentController.getStudentProfile);

module.exports = router;
