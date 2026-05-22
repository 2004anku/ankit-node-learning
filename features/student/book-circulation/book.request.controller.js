const BookCirculation = require("../../admin/book-circulation/book-circulation.model");

const Book = require("../../admin/book/book.model");

// ================= REQUEST BOOK ISSUE =================

const requestBookIssue = async (req, res) => {
  try {
    // GET LOGGED IN STUDENT ID
    const studentId = req.student.id;

    // GET BOOK ID FROM PARAMS
    const { bookId } = req.params;

    // CHECK BOOK EXISTS
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // CHECK BOOK STOCK
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is out of stock",
      });
    }

    // CHECK ALREADY REQUESTED
    const alreadyRequested = await BookCirculation.findOne({
      studentId,
      bookId,
      status: {
        $in: ["PENDING", "ISSUED"],
      },
    });

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: "Book already requested or already issued",
      });
    }

    // CREATE DUE DATE (7 DAYS)
    const dueDate = new Date();

    dueDate.setDate(dueDate.getDate() + 7);

    // CREATE REQUEST
    const request = await BookCirculation.create({
      studentId,
      bookId,
      dueDate,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Book request sent successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while requesting book",
      error: error.message,
    });
  }
};

module.exports = {
  requestBookIssue,
};
