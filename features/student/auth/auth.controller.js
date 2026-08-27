const Student = require("../../library-admin/student/student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// STUDENT LOGIN
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK STUDENT
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // CHECK PASSWORD
    const isPasswordMatched = await bcrypt.compare(password, student.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // GENERATE JWT TOKEN
    const token = jwt.sign(
      {
        id: student._id,
        role: "student",
        collegeId: student.collegeId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // SAFE RESPONSE DATA
    const safeStudent = {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      role: "student",
    };

    // RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: safeStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  studentLogin,
};
