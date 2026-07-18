const College = require("./college.model");

// ==========================================
// CREATE COLLEGE
// ==========================================
const registerCollege = async (req, res) => {
  try {
    const {
      collegeName,
      collegeCode,
      email,
      phone,
      address,
      website,
      establishedYear,
      status,
    } = req.body;

    // CHECK DUPLICATE COLLEGE CODE
    const existingCollegeCode = await College.findOne({ collegeCode });

    if (existingCollegeCode) {
      return res.status(400).json({
        success: false,
        message: "College code already exists",
      });
    }

    // CHECK DUPLICATE EMAIL
    const existingCollegeEmail = await College.findOne({ email });

    if (existingCollegeEmail) {
      return res.status(400).json({
        success: false,
        message: "College email already exists",
      });
    }

    // CHECK DUPLICATE PHONE
    const existingCollegePhone = await College.findOne({ phone });

    if (existingCollegePhone) {
      return res.status(400).json({
        success: false,
        message: "College phone already exists",
      });
    }

    // CREATE COLLEGE
    const newCollege = await College.create({
      collegeName,
      collegeCode,
      email,
      phone,
      address,
      website,
      establishedYear,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "College created successfully",
      data: newCollege,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating college",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL COLLEGES
// ==========================================
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      totalColleges: colleges.length,
      data: colleges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching colleges",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE COLLEGE
// ==========================================
const getSingleCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id).lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching college",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE COLLEGE
// ==========================================
const updateCollege = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide data to update",
      });
    }

    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "College updated successfully",
      data: updatedCollege,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating college",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE COLLEGE
// ==========================================
const deleteCollege = async (req, res) => {
  try {
    const deletedCollege = await College.findByIdAndDelete(req.params.id);

    if (!deletedCollege) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College deleted successfully",
      data: deletedCollege,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting college",
      error: error.message,
    });
  }
};

module.exports = {
  registerCollege,
  getAllColleges,
  getSingleCollege,
  updateCollege,
  deleteCollege,
};
