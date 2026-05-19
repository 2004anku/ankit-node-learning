const express = require("express");

const router = express.Router();

const issueController = require("./issue.controller");

const auth = require("../../../middleware/auth.middleware");

const isAdmin = require("../shared/middleware/isadmin.middleware");

// ISSUE BOOK
router.post("/", auth, isAdmin, issueController.issueBook);

// GET ALL ISSUED BOOKS
router.get("/", auth, isAdmin, issueController.getAllIssuedBooks);

// RETURN BOOK
router.patch("/", auth, isAdmin, issueController.returnBook);

// COLLECT FINE
router.patch(
  "/collect-fine/:issueId",
  auth,
  isAdmin,
  issueController.collectFine,
);

module.exports = router;
