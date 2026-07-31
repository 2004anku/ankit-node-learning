const BookCirculation = require("../../admin/book-circulation/book.circulation.model");
const Book = require("../../admin/book/book.model");
const Student = require("../../admin/student/student.model");

// ==========================================
// STUDENT REQUEST BOOK
// ==========================================
const requestBookIssue = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { bookId } = req.body;

    // FIND STUDENT
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // FIND BOOK IN STUDENT'S LIBRARY
    const book = await Book.findOne({
      _id: bookId,
      collegeId: student.collegeId,
      libraryId: student.libraryId,
      isDeleted: false,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // CHECK BOOK AVAILABILITY
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is out of stock",
      });
    }

    // CHECK FOR EXISTING ACTIVE REQUEST
    const alreadyRequested = await BookCirculation.findOne({
      studentId,
      bookId,
      status: {
        $in: ["pending", "issued", "return-pending"],
      },
    });

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: "Book already requested or already issued",
      });
    }

    // CREATE BOOK REQUEST
    const request = await BookCirculation.create({
      studentId: student._id,
      bookId,
      status: "pending",
      collegeId: student.collegeId,
      libraryId: student.libraryId,
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

// ==========================================
// GET MY ISSUED BOOKS
// ==========================================
const getMyBooks = async (req, res) => {
  try {
    const books = await BookCirculation.find({
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

// ==========================================
// STUDENT RETURN BOOK REQUEST
// ==========================================
const returnBookRequest = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { issueId } = req.params;

    const issue = await BookCirculation.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // VERIFY BOOK BELONGS TO LOGGED-IN STUDENT
    if (issue.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // CHECK IF RETURN REQUEST ALREADY EXISTS
    if (issue.status === "return-pending") {
      return res.status(400).json({
        success: false,
        message: "Return request already pending",
      });
    }

    // ONLY ISSUED BOOKS CAN BE RETURNED
    if (issue.status !== "issued") {
      return res.status(400).json({
        success: false,
        message: "Only issued books can be returned",
      });
    }

    // UPDATE STATUS
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
