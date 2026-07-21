const Library = require("./library.model");
const College = require("../../super-admin/college/college.model");

// ==========================================
// CREATE LIBRARY
// ==========================================

const registerLibrary = async (req, res) => {
  try {
    const { libraryName, email, phone, workingHours, status, plan } = req.body;

    // GET COLLEGE FROM LOGGED-IN COLLEGE ADMIN
    const collegeId = req.user.collegeId;

    // CHECK COLLEGE EXISTS
    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // CHECK DUPLICATE EMAIL IN SAME COLLEGE
    const existingEmail = await Library.findOne({
      email,
      collegeId,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Library email already exists",
      });
    }

    // CHECK DUPLICATE PHONE IN SAME COLLEGE
    const existingPhone = await Library.findOne({
      phone,
      collegeId,
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Library phone already exists",
      });
    }

    // CREATE LIBRARY
    const newLibrary = await Library.create({
      libraryName,
      email,
      phone,

      workingHours,
      status,
      plan,

      collegeId,
    });

    return res.status(201).json({
      success: true,
      message: "Library registered successfully",
      data: newLibrary,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error registering library",
      error: err.message,
    });
  }
};
// ==========================================
// GET ALL LIBRARIES
// ==========================================
const getLibraries = async (req, res) => {
  try {
    const libraries = await Library.find({
      collegeId: req.user.collegeId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Libraries fetched successfully",
      totalLibraries: libraries.length,
      data: libraries,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching libraries",
      error: err.message,
    });
  }
};
// ==========================================
// UPDATE LIBRARY
// ==========================================
const updateLibrary = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide data to update",
      });
    }

    const updatedLibrary = await Library.findOneAndUpdate(
      {
        _id: req.params.id,
        collegeId: req.user.collegeId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedLibrary) {
      return res.status(404).json({
        success: false,
        message: "Library not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Library updated successfully",
      data: updatedLibrary,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating library",
      error: err.message,
    });
  }
};
// ==========================================
// DELETE LIBRARY
// ==========================================
const deleteLibrary = async (req, res) => {
  try {
    const deletedLibrary = await Library.findOneAndDelete({
      _id: req.params.id,
      collegeId: req.user.collegeId,
    });

    if (!deletedLibrary) {
      return res.status(404).json({
        success: false,
        message: "Library not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Library deleted successfully",
      data: deletedLibrary,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting library",
      error: err.message,
    });
  }
};
module.exports = {
  registerLibrary,
  getLibraries,
  updateLibrary,
  deleteLibrary,
};
