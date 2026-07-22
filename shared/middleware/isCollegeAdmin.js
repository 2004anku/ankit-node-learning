const isCollegeAdmin = (req, res, next) => {
  // User not authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // User is authenticated but not a College Admin
  if (req.user.role !== "college-admin") {
    return res.status(403).json({
      success: false,
      message: "College Admin access only",
    });
  }

  // College Admin must belong to a college
  if (!req.user.collegeId) {
    return res.status(403).json({
      success: false,
      message: "College not assigned",
    });
  }

  next();
};

module.exports = isCollegeAdmin;
