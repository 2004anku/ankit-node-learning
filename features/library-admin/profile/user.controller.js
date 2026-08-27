const User = require("../../user/user.model");
// ==========================================
// GET LOGGED-IN LIBRARIAN PROFILE
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("collegeId")
      .populate("libraryId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE LOGGED-IN LIBRARIAN PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, gender } = req.body;

    const updatedProfile = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        phone,
        gender,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("-password")
      .populate("collegeId")
      .populate("libraryId");

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
