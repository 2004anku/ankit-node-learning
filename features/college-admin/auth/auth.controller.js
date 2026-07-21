const User = require("../../admin/useraccount/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==========================================
// COLLEGE ADMIN LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({
      email,
      role: "college-admin",
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // CHECK ACCOUNT STATUS
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    // VERIFY PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // UPDATE LAST LOGIN
    user.lastLogin = new Date();

    await user.save();

    // CREATE JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        collegeId: user.collegeId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while login",
      error: error.message,
    });
  }
};

module.exports = {
  login,
};
