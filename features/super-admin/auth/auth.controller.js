const SuperAdmin = require("./auth.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND SUPER ADMIN
    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // CHECK STATUS
    if (!superAdmin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    // VERIFY PASSWORD
    const isMatch = await bcrypt.compare(password, superAdmin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // UPDATE LAST LOGIN
    superAdmin.lastLogin = new Date();

    await superAdmin.save();

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: superAdmin._id,
        type: "super-admin",
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
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
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
