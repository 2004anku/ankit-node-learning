const express = require("express");
const router = express.Router();

const bookController = require("./book.controller");

const isLibraryAdmin = require("../../../shared/middleware/isLibraryAdmin");
const validate = require("../../../shared/middleware/form.validation");

const {
  createBookValidationSchema,
  updateBookValidationSchema,
} = require("./book.validation");

// CREATE BOOK
router.post(
  "/create-book",
  isLibraryAdmin,
  validate(createBookValidationSchema),
  bookController.addBook,
);

// GET ALL BOOKS
router.get("/all-books", isLibraryAdmin, bookController.getAllBooks);
// UPDATE BOOK
router.patch(
  "/update-book/:id",
  isLibraryAdmin,
  validate(updateBookValidationSchema),
  bookController.updateBook,
);

// DELETE BOOK
router.delete("/remove-book/:id", isLibraryAdmin, bookController.deleteBook);

// ACHIVED BOOKS
router.get("/archived-books", isLibraryAdmin, bookController.getArchivedBooks);

// RESTORE
router.patch("/restore-book/:id", isLibraryAdmin, bookController.restoreBook);
module.exports = router;
