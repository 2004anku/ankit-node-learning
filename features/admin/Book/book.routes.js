const express = require("express");
const router = express.Router();

const bookController = require("./book.controller");
const admin = require("./../shared/middleware/isAdmin");

// CREATE BOOK
router.post("/", admin, bookController.addBook);

// GET ALL BOOKS
router.get("/", admin, bookController.getAllBooks);

// UPDATE BOOK
router.patch("/:id", admin, bookController.updateBook);

// DELETE BOOK
router.delete("/:id", admin, bookController.deleteBook);

module.exports = router;
