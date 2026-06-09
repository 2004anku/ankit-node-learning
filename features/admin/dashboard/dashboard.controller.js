const Student = require("../student/student.model");
const Book = require("../book/book.model");
const Library = require("../library/library.model");
const BookRequest = require("../book-circulation/book-circulation.model");

const getDashboardStats = async (req, res) => {
  try {
    // Dashboard Counts
    const totalStudents = await Student.countDocuments();

    const totalBooks = await Book.countDocuments();

    const totalLibraries = await Library.countDocuments();

    const pendingRequests = await BookRequest.countDocuments({
      status: "PENDING",
    });

    const approvedRequests = await BookRequest.countDocuments({
      status: "APPROVED",
    });

    const issuedBooks = await BookRequest.countDocuments({
      status: "ISSUED",
    });

    const returnedBooks = await BookRequest.countDocuments({
      status: "RETURNED",
    });

    // Latest Requests
    const recentRequests = await BookRequest.find()
      .populate("studentId", "fullName email")
      .populate("bookId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        totalLibraries,
        totalStudents,
        totalBooks,

        requests: {
          pending: pendingRequests,
          approved: approvedRequests,
        },

        circulation: {
          issued: issuedBooks,
          returned: returnedBooks,
        },

        recentRequests,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
