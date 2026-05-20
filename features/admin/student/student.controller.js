const Student = require("./student.model");
const studentValidationSchema = require("./student.validation");

// CREATE STUDENT
const createStudent = async (req, res) => {
  try {
    const { studentName, phone, course, semester } = req.body;

    // REQUIRED FIELD VALIDATION
    const { error } = studentValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // PHONE VALIDATION
    {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    // CREATE STUDENT
    const student = await Student.create({
      studentName,
      phone,
      course,
      semester,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating student",
      error: error.message,
    });
  }
};

// GET ALL STUDENTS
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      totalStudents: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching students",
      error: error.message,
    });
  }
};

// GET SINGLE STUDENT
const getSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    // CHECK STUDENT EXISTS
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching student",
      error: error.message,
    });
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // CHECK EMPTY BODY
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide data to update",
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // CHECK STUDENT EXISTS
    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating student",
      error: error.message,
    });
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    // CHECK STUDENT EXISTS
    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent,
    });
  } catch (error) {
    res.status(500).json({
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
