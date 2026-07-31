const User = require("../useraccount/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email })
      .populate("collegeId", "collegeName")
      .populate("libraryId", "libraryName");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        collegeId: user.collegeId?._id,
        libraryId: user.libraryId?._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // SAFE RESPONSE
    const safeUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,

      collegeId: user.collegeId?._id || null,
      libraryId: user.libraryId?._id || null,

      collegeName: user.collegeId?.collegeName || "",
      libraryName: user.libraryId?.libraryName || "",
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: safeUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while login",
      error: err.message,
    });
  }
};
module.exports = {
  login,
};
