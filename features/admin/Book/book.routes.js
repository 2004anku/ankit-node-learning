const express = require("express");

const router = express.Router();

const bookController = require("./book.controller");

// CREATE  BOOK
router.post("/", bookController.addBook);

// GET ALL BOOK
router.get("/", bookController.getAllBooks);

// UPDAET BOOK
router.patch("/:id", bookController.updateBook);

// DELETE BOOK
router.delete("/:id", bookController.deleteBook);

module.exports = router;
