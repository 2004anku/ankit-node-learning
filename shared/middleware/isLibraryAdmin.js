const jwt = require("jsonwebtoken");

const isLibraryAdmin = (req, res, next) => {
  try {
    // GET TOKEN FROM AUTH HEADER
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ALLOW ONLY LIBRARIAN
    if (decoded.role !== "library-admin") {
      return res.status(403).json({
        success: false,
        message: "Library Admin access only",
      });
    }

    // ATTACH USER DATA
    req.user = {
      id: decoded.id,
      role: decoded.role,
      collegeId: decoded.collegeId,
      libraryId: decoded.libraryId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
};

module.exports = isLibraryAdmin;
