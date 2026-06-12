const Book = require("../book/book.model");
const Student = require("../student/student.model");
const Issue = require("../book-circulation/book-circulation.model");

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const totalBooks = await Book.countDocuments();

    const totalRequests = await Issue.countDocuments({
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalBooks,
        totalRequests,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
