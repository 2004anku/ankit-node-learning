const Student = require("./student.model");
const bcrypt = require("bcrypt");
const Issue = require("../book-circulation/book.circulation.model");

// ================= CREATE STUDENT =================

const createStudent = async (req, res) => {
  try {
    const { studentName, email, password, phone, course, semester } = req.body;

    // CHECK REQUIRED FIELDS
    if (!studentName || !email || !password || !phone || !course || !semester) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // CHECK EXISTING EMAIL
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists with this email",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE STUDENT
    const student = await Student.create({
      studentName,
      email,
      password: hashedPassword,
      phone,
      course,
      semester,
      collegeId: req.user.collegeId,
    });

    // REMOVE PASSWORD FROM RESPONSE
    const studentResponse = student.toObject();
    delete studentResponse.password;

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: studentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating student",
      error: error.message,
    });
  }
};

// ================= GET ALL STUDENTS =================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({
      collegeId: req.user.collegeId,
      isDeleted: false,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      totalStudents: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching students",
      error: error.message,
    });
  }
};

// ================= GET SINGLE STUDENT =================

const getSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      _id: id,
      collegeId: req.user.collegeId,
      isDeleted: false,
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching student",
      error: error.message,
    });
  }
};

// ================= UPDATE STUDENT =================

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide data to update",
      });
    }

    // ALLOWED STUDENT FIELDS
    const allowedFields = [
      "studentName",
      "email",
      "phone",
      "course",
      "semester",
      "status",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // HASH PASSWORD SEPARATELY
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    // CHECK IF THERE IS ANY VALID FIELD TO UPDATE
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      {
        _id: id,
        collegeId: req.user.collegeId,
        isDeleted: false,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating student",
      error: error.message,
    });
  }
};

// ================= DELETE STUDENT =================

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findOneAndUpdate(
      {
        _id: id,
        collegeId: req.user.collegeId,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student archived successfully",
      data: deletedStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting student",
      error: error.message,
    });
  }
};

// ================= STUDENT PROFILE =================

const getStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      _id: id,
      collegeId: req.user.collegeId,
      isDeleted: false,
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const issuedBooks = await Issue.find({
      studentId: id,
      status: "issued",
    }).populate("bookId");

    const returnedBooks = await Issue.find({
      studentId: id,
      status: "returned",
    }).populate("bookId");

    const pendingBooks = await Issue.find({
      studentId: id,
      status: {
        $in: ["pending", "return-pending"],
      },
    }).populate("bookId");

    return res.status(200).json({
      success: true,
      data: {
        student,
        issuedBooks,
        returnedBooks,
        pendingBooks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// ================= RESTORE STUDENT =================

const restoreStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOneAndUpdate(
      {
        _id: id,
        collegeId: req.user.collegeId,
        isDeleted: true,
      },
      {
        isDeleted: false,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Archived student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student restored successfully",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error restoring student",
      error: error.message,
    });
  }
};

// ================= GET ARCHIVED STUDENTS =================

const getArchivedStudents = async (req, res) => {
  try {
    const students = await Student.find({
      collegeId: req.user.collegeId,
      isDeleted: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Archived students fetched successfully",
      totalStudents: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching archived students",
      error: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  restoreStudent,
  getArchivedStudents,
};
