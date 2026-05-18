const Book = require("./book.model");

// ADD BOOK
const addBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);

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
    const books = await Book.find().populate("libraryId");

    res.status(200).json({
      message: "All Books Fetched Successfully",
      totalBooks: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error While Fetching Books",
      error: error.message,
    });
  }
};

// UPDATE BOOK
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book Updated Successfully",
      data: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Updating Book",
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
        message: "Book Not Found",
      });
    }

    res.status(200).json({
      message: "Book Deleted Successfully",
      deletedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error While Deleting Book",
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
