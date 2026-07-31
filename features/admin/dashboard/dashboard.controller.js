const Student = require("../student/student.model");
const Book = require("../book/book.model");
const Issue = require("../book-circulation/book.circulation.model");

// ==========================================
// DASHBOARD STATS
// ==========================================
const getDashboardStats = async (req, res) => {
  try {
    const filter = {
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    };

    // CHECK ALL ISSUES
    const allIssues = await Issue.find().select(
      "fine finePaid status collegeId libraryId",
    );

    // CHECK AGGREGATION RESULT
    const debugFine = await Issue.aggregate([
      {
        $match: {
          finePaid: false,
        },
      },
      {
        $group: {
          _id: null,
          totalFine: {
            $sum: "$fine",
          },
        },
      },
    ]);

    const [
      totalStudents,
      totalBooks,
      booksIssued,
      pendingRequests,
      returnRequests,
      fineData,
      availableBooksData,
    ] = await Promise.all([
      Student.countDocuments(filter),

      Book.countDocuments(filter),

      Issue.countDocuments({
        ...filter,
        status: "issued",
      }),

      Issue.countDocuments({
        ...filter,
        status: "pending",
      }),

      Issue.countDocuments({
        ...filter,
        status: "return-pending",
      }),

      Issue.aggregate([
        {
          $match: {
            ...filter,
            status: "returned",
            finePaid: false,
            fine: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: null,
            totalFine: {
              $sum: "$fine",
            },
          },
        },
      ]),

      Book.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: null,
            totalAvailableBooks: {
              $sum: "$availableCopies",
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalBooks,
        booksAvailable: availableBooksData[0]?.totalAvailableBooks || 0,
        booksIssued,
        pendingRequests,
        returnRequests,
        totalFinePending: fineData[0]?.totalFine || 0,
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
// ==========================================
// SEARCH STUDENTS
// ==========================================
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
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
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
