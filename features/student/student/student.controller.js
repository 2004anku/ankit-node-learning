const Student = require("../../library-admin/student/student.model");
const Issue = require("../../library-admin/book-circulation/book.circulation.model");

const Book = require("../../library-admin/book/book.model");

// ================= GET STUDENT PROFILE =================

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL LIBRARY BOOKS =================
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
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

module.exports = {
  getStudentProfile,
  getAllBooks,
};
