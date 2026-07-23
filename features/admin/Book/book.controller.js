const Book = require("./book.model");
const bookValidationSchema = require("./book.validation");
const Library = require("../../college-admin/library/library.model");

// ==========================================
// CREATE BOOK
// ==========================================

const addBook = async (req, res) => {
  try {
    const { bookName, author, category, isbn, totalCopies, price } = req.body;

    const collegeId = req.user.collegeId._id || req.user.collegeId;
    const libraryId = req.user.libraryId._id || req.user.libraryId;

    // CHECK IF ISBN ALREADY EXISTS IN THIS LIBRARY
    const existingBook = await Book.findOne({
      isbn,
      libraryId,
      isDeleted: false,
    });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: "A book with this ISBN already exists in this library.",
      });
    }

    // CREATE BOOK
    const newBook = await Book.create({
      bookName,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies: totalCopies,
      price,
      collegeId,
      libraryId,
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: newBook,
    });
  } catch (error) {
    console.error("BOOK ERROR:", error);

    // HANDLE DUPLICATE KEY ERROR
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A book with this ISBN already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error while adding book",
      error: error.message,
    });
  }
};
// GET ALL BOOKS
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
      isDeleted: false,
    }).populate("libraryId");
    res.status(200).json({
      success: true,
      message: "All books fetched successfully",
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

// ==========================================
// UPDATE BOOK
// ==========================================

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

    // CHECK BOOK BELONGS TO CURRENT LIBRARY
    const existingBook = await Book.findOne({
      _id: bookId,
      libraryId: req.user.libraryId,
      collegeId: req.user.collegeId,
      isDeleted: false,
    });

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // UPDATE BOOK
    const updatedBook = await Book.findOneAndUpdate(
      {
        _id: bookId,
        libraryId: req.user.libraryId,
        collegeId: req.user.collegeId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating book",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE (ARCHIVE) BOOK
// ==========================================

const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        libraryId: req.user.libraryId,
        collegeId: req.user.collegeId,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book archived successfully",
      data: deletedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting book",
      error: error.message,
    });
  }
}; // ==========================================
// GET ARCHIVED BOOKS
// ==========================================

const getArchivedBooks = async (req, res) => {
  try {
    const books = await Book.find({
      libraryId: req.user.libraryId,
      collegeId: req.user.collegeId,
      isDeleted: true,
    });

    res.status(200).json({
      success: true,
      message: "Archived books fetched successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching archived books",
      error: error.message,
    });
  }
};

// ==========================================
// RESTORE BOOK
// ==========================================

const restoreBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        libraryId: req.user.libraryId,
        collegeId: req.user.collegeId,
        isDeleted: true,
      },
      {
        isDeleted: false,
      },
      {
        new: true,
      },
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book restored successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error restoring book",
      error: error.message,
    });
  }
};
module.exports = {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getArchivedBooks,
  restoreBook,
};
