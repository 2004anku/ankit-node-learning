const User = require("../../admin/useraccount/user.model");
const Library = require("../../college-admin/library/library.model");

const bcrypt = require("bcrypt");

// ==========================================
// CREATE LIBRARY ADMIN
// ==========================================

const createLibraryAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phone, libraryId, isActive } = req.body;

    // CHECK LIBRARY EXISTS
    const library = await Library.findById(libraryId);

    if (!library) {
      return res.status(404).json({
        success: false,
        message: "Library not found",
      });
    }

    // CHECK EMAIL
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // CHECK PHONE
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE LIBRARY ADMIN
    const libraryAdmin = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,

      role: "library-admin",

      collegeId: library.collegeId,

      libraryId: library._id,

      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Library Admin created successfully",
      data: {
        id: libraryAdmin._id,
        fullName: libraryAdmin.fullName,
        email: libraryAdmin.email,
        phone: libraryAdmin.phone,
        role: libraryAdmin.role,
        collegeId: libraryAdmin.collegeId,
        libraryId: libraryAdmin.libraryId,
        isActive: libraryAdmin.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating Library Admin",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL LIBRARY ADMINS
// ==========================================

const getAllLibraryAdmins = async (req, res) => {
  try {
    const libraryAdmins = await User.find({ role: "library-admin" })
      .select("-password")
      .populate({
        path: "collegeId",
        select: "collegeName collegeCode",
      })
      .populate({
        path: "libraryId",
        select: "libraryName",
      });

    res.status(200).json({
      success: true,
      totalLibraryAdmins: libraryAdmins.length,
      data: libraryAdmins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching library admins",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE LIBRARY ADMIN
// ==========================================
const getSingleLibraryAdmin = async (req, res) => {
  try {
    const libraryAdmin = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "collegeId",
        select: "collegeName collegeCode",
      })
      .populate({
        path: "libraryId",
        select: "libraryName",
      });

    if (!libraryAdmin) {
      return res.status(404).json({
        success: false,
        message: "Library Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: libraryAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching library admin",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE LIBRARY ADMIN
// ==========================================

const updateLibraryAdmin = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide data to update",
      });
    }

    // IF LIBRARY CHANGED
    if (req.body.libraryId) {
      const library = await Library.findById(req.body.libraryId);

      if (!library) {
        return res.status(404).json({
          success: false,
          message: "Library not found",
        });
      }

      req.body.collegeId = library.collegeId;
    }

    // HASH PASSWORD IF UPDATED
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedLibraryAdmin = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "library-admin",
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedLibraryAdmin) {
      return res.status(404).json({
        success: false,
        message: "Library Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Library Admin updated successfully",
      data: updatedLibraryAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating Library Admin",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE LIBRARY ADMIN
// ==========================================

const deleteLibraryAdmin = async (req, res) => {
  try {
    const deletedLibraryAdmin = await User.findOneAndDelete({
      _id: req.params.id,
      role: "library-admin",
    });

    if (!deletedLibraryAdmin) {
      return res.status(404).json({
        success: false,
        message: "Library Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Library Admin deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting Library Admin",
      error: error.message,
    });
  }
};

module.exports = {
  createLibraryAdmin,
  getAllLibraryAdmins,
  getSingleLibraryAdmin,
  updateLibraryAdmin,
  deleteLibraryAdmin,
};
