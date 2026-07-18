const jwt = require("jsonwebtoken");

// ==========================================
// SUPER ADMIN AUTHORIZATION MIDDLEWARE
// ==========================================

const isSuperAdmin = (req, res, next) => {
  try {
    // GET AUTHORIZATION HEADER
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // VERIFY USER TYPE
    if (decoded.type !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super Admin only.",
      });
    }

    // ATTACH USER DETAILS
    req.user = {
      id: decoded.id,
      type: decoded.type,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = isSuperAdmin;
