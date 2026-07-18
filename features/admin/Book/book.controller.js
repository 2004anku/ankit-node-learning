const Book = require("./book.model");
const bookValidationSchema = require("./book.validation");
const Library = require("../../super-admin/library/library.model");

// ADD BOOK
const addBook = async (req, res) => {
  try {
    const { bookName, author, category, isbn, totalCopies, price } = req.body;

    // AUTO FETCH FIRST LIBRARY
    const library = await Library.findOne();

    if (!library) {
      return res.status(404).json({
        success: false,
        message: "No library found",
      });
    }

    const newBook = await Book.create({
      bookName,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies: totalCopies,
      libraryId: library._id,
      price,
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: newBook,
    });
  } catch (error) {
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

    const existingBook = await Book.findOne({
      _id: bookId,
      isDeleted: false,
    });

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
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
    const deletedBook = await Book.findByIdAndUpdate(
      req.params.id,
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

    res.status(200).json({
      success: true,
      message: "Book archived successfully",
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
const getArchivedBooks = async (req, res) => {
  const books = await Book.find({ isDeleted: true });

  res.status(200).json({
    success: true,
    data: books,
  });
};

const restoreBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true },
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
