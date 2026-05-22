const BookCirculation = require("../../admin/book-circulation/book-circulation.model");

const Book = require("../../admin/book/book.model");

// ================= REQUEST BOOK ISSUE =================

const requestBookIssue = async (req, res) => {
  try {
    // GET LOGGED IN STUDENT ID
    const studentId = req.student.id;
    // GET BOOK ID FROM PARAMS
    const { bookId } = req.body;

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
        $in: ["pending", "issued"],
      },
    });

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: "Book already requested or already issued",
      });
    }

    // CREATE REQUEST
    const request = await BookCirculation.create({
      studentId,
      bookId,
      status: "pending",
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

const getMyBooks = async (req, res) => {
  try {
    const books = await Issue.find({
      studentId: req.user.id,
      status: "issued",
    }).populate("bookId");

    return res.status(200).json({
      success: true,
      total: books.length,
      data: books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching books",
      error: error.message,
    });
  }
};

const returnBookRequest = async (req, res) => {
  try {
    const studentId = req.student.id;

    const { issueId } = req.params;

    const issue = await BookCirculation.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // SECURITY CHECK
    if (issue.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ONLY ISSUED BOOK CAN BE RETURNED
    if (issue.status !== "issued") {
      return res.status(400).json({
        success: false,
        message: "Only issued books can be returned",
      });
    }

    // SEND RETURN REQUEST
    issue.status = "return-pending";

    await issue.save();

    return res.status(200).json({
      success: true,
      message: "Return request sent successfully",
      data: issue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while sending return request",
      error: error.message,
    });
  }
};
module.exports = {
  requestBookIssue,
  getMyBooks,
  returnBookRequest,
};
