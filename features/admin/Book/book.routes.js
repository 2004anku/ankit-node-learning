const express = require("express");
const router = express.Router();

const bookController = require("./book.controller");
const auth = require("../../../middleware/auth.middleware");
const isAdmin = require("../shared/middleware/isAdmin.middleware");

// CREATE BOOK
router.post("/", auth, isAdmin, bookController.addBook);

// GET ALL BOOKS
router.get("/", auth, bookController.getAllBooks);

// UPDATE BOOK
router.patch("/:id", auth, isAdmin, bookController.updateBook);

// DELETE BOOK
router.delete("/:id", auth, isAdmin, bookController.deleteBook);

module.exports = router;
