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

// ==========================================
// GET ALL COLLEGE ADMINS
// ==========================================

const getCollegeAdmins = async (req, res) => {
  try {
    const collegeAdmins = await User.find({
      role: "college-admin",
    })
      .select("-password")
      .populate("collegeId", "collegeName collegeCode")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalCollegeAdmins: collegeAdmins.length,
      data: collegeAdmins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching College Admins",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE COLLEGE ADMIN
// ==========================================

const updateCollegeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const { fullName, email, phone, isActive } = req.body;

    const collegeAdmin = await User.findOne({
      _id: id,
      role: "college-admin",
    });

    if (!collegeAdmin) {
      return res.status(404).json({
        success: false,
        message: "College Admin not found",
      });
    }

    // Check duplicate email
    if (email && email !== collegeAdmin.email) {
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: id },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      collegeAdmin.email = email;
    }

    if (fullName) collegeAdmin.fullName = fullName;
    if (phone) collegeAdmin.phone = phone;

    if (typeof isActive === "boolean") {
      collegeAdmin.isActive = isActive;
    }

    await collegeAdmin.save();

    return res.status(200).json({
      success: true,
      message: "College Admin updated successfully",
      data: {
        id: collegeAdmin._id,
        fullName: collegeAdmin.fullName,
        email: collegeAdmin.email,
        phone: collegeAdmin.phone,
        role: collegeAdmin.role,
        collegeId: collegeAdmin.collegeId,
        isActive: collegeAdmin.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating College Admin",
      error: error.message,
    });
  }
};
module.exports = {
  createCollegeAdmin,
  getCollegeAdmins,
  updateCollegeAdmin,
};
