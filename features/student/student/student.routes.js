const express = require("express");

const router = express.Router();

const studentController = require("./student.controller");

const isStudent = require("../_shared/middleware/isStudent");

const formValidation = require("../../../shared/middleware/form.validation");

const { loginValidation } = require("./student.validation");

const { studentLogin } = require("../auth/auth.controller");
const {
  requestBookIssue,
} = require("../book-circulation/book.request.controller");

//LOGIN STUDENT
router.post("/login", formValidation(loginValidation), studentLogin);

// GET ALL BOOKS

router.get("/all-book", isStudent, studentController.getAllBooks);

// REQUEST
router.post("/request/:bookId", isStudent, requestBookIssue);
module.exports = router;
