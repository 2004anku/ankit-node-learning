const express = require("express");
const router = express.Router();

const bookController = require("./book.controller");
const isAdmin = require("../../../shared/middleware/isAdmin");
// CREATE BOOK
router.post("/", isAdmin, bookController.addBook);

// GET ALL BOOKS
router.get("/", isAdmin, bookController.getAllBooks);

// UPDATE BOOK
router.patch("/:id", isAdmin, bookController.updateBook);

// DELETE BOOK
router.delete("/:id", isAdmin, bookController.deleteBook);

module.exports = router;
