const User = require("../../admin/useraccount/user.model");
const College = require("../college/college.model");

const bcrypt = require("bcrypt");

// ==========================================
// CREATE COLLEGE ADMIN
// ==========================================

const createCollegeAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phone, collegeId } = req.body;

    // CHECK COLLEGE EXISTS
    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // CHECK EXISTING COLLEGE ADMIN
    const existingAdmin = await User.findOne({
      role: "college-admin",
      collegeId,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "College Admin already exists for this college",
      });
    }

    // CHECK DUPLICATE EMAIL
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const collegeAdmin = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,

      role: "college-admin",

      collegeId,
      libraryId: null,
    });

    return res.status(201).json({
      success: true,
      message: "College Admin created successfully",
      data: {
        id: collegeAdmin._id,
        fullName: collegeAdmin.fullName,
        email: collegeAdmin.email,
        phone: collegeAdmin.phone,
        role: collegeAdmin.role,
        collegeId: collegeAdmin.collegeId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating College Admin",
      error: error.message,
    });
  }
};

module.exports = {
  createCollegeAdmin,
};
