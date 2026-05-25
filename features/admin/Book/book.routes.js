const express = require("express");
const router = express.Router();

const bookController = require("./book.controller");

const isAdmin = require("../../../shared/middleware/isAdmin");

const validate = require("../../../shared/middleware/form.validation");

const {
  createBookValidationSchema,
  updateBookValidationSchema,
} = require("./book.validation");

// CREATE BOOK
router.post(
  "/create-book",
  isAdmin,
  validate(createBookValidationSchema),
  bookController.addBook,
);

// GET ALL BOOKS
router.get("/all-books", isAdmin, bookController.getAllBooks);

// UPDATE BOOK
router.patch(
  "/update-book/:id",
  isAdmin,
  validate(updateBookValidationSchema),
  bookController.updateBook,
);

// DELETE BOOK
router.delete("/remove-book/:id", isAdmin, bookController.deleteBook);

module.exports = router;
