const Student = require("./student.model");
const bcrypt = require("bcrypt");

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
    const students = await Student.find().select("-password");

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

    const student = await Student.findById(id).select("-password");

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

    // HASH PASSWORD IF PASSWORD IS UPDATED
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

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

    const deletedStudent =
      await Student.findByIdAndDelete(id).select("-password");

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
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

module.exports = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
