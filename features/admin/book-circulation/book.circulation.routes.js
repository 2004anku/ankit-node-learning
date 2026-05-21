const express = require("express");
const router = express.Router();

const issueController = require("./book.circulation.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");
const validate = require("../../../shared/middleware/form.validation");
const issueBookValidationSchema = require("./book.circulation.validation");
// ISSUE BOOK
router.post(
  "/book-issue",
  isAdmin,
  validate(issueBookValidationSchema),
  issueController.issueBook,
);

// GET ALL ISSUED BOOKS
router.get("/book-issued", isAdmin, issueController.getAllIssuedBooks);

// RETURN BOOK
router.patch(
  "/return-book/:issueId",
  isAdmin,
  validate(issueBookValidationSchema),
  issueController.returnBook,
);

// COLLECT FINE
router.patch(
  "/collect-fine/:issueId",
  isAdmin,
  validate(issueBookValidationSchema),
  issueController.collectFine,
);

module.exports = router;
