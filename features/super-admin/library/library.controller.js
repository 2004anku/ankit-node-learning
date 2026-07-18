const Library = require("./library.model");
const College = require("../college/college.model");

// ==========================================
// CREATE LIBRARY
// ==========================================

const registerLibrary = async (req, res) => {
  try {
    const {
      collegeId,
      libraryHead,
      ownerName,
      email,
      phone,
      address,
      workingHours,
      status,
      plan,
    } = req.body;

    // CHECK COLLEGE EXISTS
    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // CHECK DUPLICATE EMAIL
    const existingEmail = await Library.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Library email already exists",
      });
    }

    // CHECK DUPLICATE PHONE
    const existingPhone = await Library.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Library phone already exists",
      });
    }

    // CREATE LIBRARY
    const newLibrary = await Library.create({
      collegeId,
      libraryName,
      ownerName,
      email,
      phone,
      address,
      workingHours,
      status,
      plan,
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
    const libraries = await Library.find()
      .populate("collegeId", "collegeName collegeCode")
      .sort({ createdAt: -1 });

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

    const updatedLibrary = await Library.findByIdAndUpdate(
      req.params.id,
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
    const deletedLibrary = await Library.findByIdAndDelete(req.params.id);

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
