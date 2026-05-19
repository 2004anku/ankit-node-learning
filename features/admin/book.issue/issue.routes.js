const express = require("express");

const router = express.Router();

const issueController = require("./issue.controller");
const admin = require("../shared/middleware/isAdmin");

// ISSUE BOOK
router.post("/", admin, issueController.issueBook);

// GET ALL ISSUED BOOKS
router.get("/", admin, issueController.getAllIssuedBooks);

// RETURN BOOK
router.patch("/", admin, issueController.returnBook);

// COLLECT FINE
router.patch("/collect-fine/:issueId", admin, issueController.collectFine);

module.exports = router;
