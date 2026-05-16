const Book = require("./book.model");

// ADD BOOK
const addBook = async (req, res) => {
  try {
    const newBook = new Book({
      bookId: req.body.bookId,
      bookName: req.body.bookName,
      author: req.body.author,
      category: req.body.category,
      isbn: req.body.isbn,
      totalCopies: req.body.totalCopies,
      availableCopies: req.body.availableCopies,
      libraryId: req.body.libraryId,
    });

    await newBook.save();

    res.status(201).json({
      message: "Book Added Successfully",
      book: newBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error While Adding Book",
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
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book Not Found",
      });
    }

    res.status(200).json({
      message: "Book Updated Successfully",
      updatedBook,
    });
  } catch (error) {
    res.status(500).json({
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
