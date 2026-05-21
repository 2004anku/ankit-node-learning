const BookCirculation = require("../../admin/book-circulation/book-circulation.model");

const Book = require("../../admin/book/book.model");

// ================= REQUEST BOOK ISSUE =================

const requestBookIssue = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { bookId } = req.params;

    // CHECK BOOK EXISTS
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // CHECK ALREADY REQUESTED
    const alreadyRequested = await BookCirculation.findOne({
      student: studentId,
      book: bookId,
      status: {
        $in: ["PENDING"],
      },
    });

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: "Book already requested",
      });
    }

    // CREATE REQUEST
    const request = await BookCirculation.create({
      student: studentId,
      book: bookId,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Book issue request sent",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  requestBookIssue,
};
