const User = require("../useraccount/user.model");

// ==========================================
// GET MY PROFILE
// ==========================================

const getMyProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user.id)
      .select("-password")
      .populate("collegeId", "collegeName collegeCode email phone")
      .populate("libraryId", "libraryName email phone");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
};
