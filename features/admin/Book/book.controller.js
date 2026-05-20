const Book = require("./book.model");
const bookValidationSchema = require("./book.validation");

// ADD BOOK
const addBook = async (req, res) => {
  try {
    const {
      bookName,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies,
      libraryId,
      price,
    } = req.body;

    // REQUIRED FIELD VALIDATION
    const { error } = bookValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // CREATE BOOK
    const newBook = await Book.create({
      bookName,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies,
      libraryId,
      price,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: newBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while adding book",
      error: error.message,
    });
  }
};

// GET ALL BOOKS
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("libraryId");

    res.status(200).json({
      success: true,
      message: "All books fetched successfully",
      totalBooks: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching books",
      error: error.message,
    });
  }
};

// UPDATE BOOK
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // CHECK EMPTY BODY
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide data to update",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating book",
      error: error.message,
    });
  }
};

// DELETE BOOK
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while deleting book",
      error: error.message,
    });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
};
