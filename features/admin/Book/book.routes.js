const express = require("express");
const router = express.Router();

const bookController = require("./book.controller");
const auth = require("../../../middleware/auth.middleware");

// CREATE BOOK
router.post("/", auth, bookController.addBook);

// GET ALL BOOKS
router.get("/", auth, bookController.getAllBooks);

// UPDATE BOOK
router.patch("/:id", auth, bookController.updateBook);

// DELETE BOOK
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;
