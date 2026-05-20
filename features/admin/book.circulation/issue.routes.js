const express = require("express");

const router = express.Router();

const issueController = require("./issue.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");
// ISSUE BOOK
router.post("/book-issue", isAdmin, issueController.issueBook);

// GET ALL ISSUED BOOKS
router.get("/book-issued", isAdmin, issueController.getAllIssuedBooks);

// RETURN BOOK
router.patch("/return-book", isAdmin, issueController.returnBook);

// COLLECT FINE
router.patch("/collect-fine/:issueId", isAdmin, issueController.collectFine);

module.exports = router;
