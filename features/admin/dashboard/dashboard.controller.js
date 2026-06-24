const Student = require("../student/student.model");
const Book = require("../book/book.model");
const Issue = require("../book-circulation/book.circulation.model");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalBooks,
      booksIssued,
      pendingRequests,
      returnRequests,
      fineData,
    ] = await Promise.all([
      Student.countDocuments(),
      Book.countDocuments(),
      Issue.countDocuments({ status: "issued" }),
      Issue.countDocuments({ status: "pending" }),
      Issue.countDocuments({ status: "return-pending" }),
      Student.aggregate([
        {
          $group: {
            _id: null,
            totalFine: { $sum: "$fine" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalBooks,
        booksIssued,
        pendingRequests,
        returnRequests,
        totalFinePending: fineData[0]?.totalFine || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

const searchStudents = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const students = await Student.find({
      studentName: {
        $regex: q,
        $options: "i",
      },
    })
      .select("studentName email course semester")
      .limit(10);

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error searching students",
      error: error.message,
    });
  }
};
module.exports = {
  getDashboardStats,
  searchStudents,
};
