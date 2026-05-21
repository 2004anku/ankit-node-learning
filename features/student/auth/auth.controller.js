const Student = require("../../admin/student/student.model");
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
        role: student.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // RESPONSE
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        role: student.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  studentLogin,
};
