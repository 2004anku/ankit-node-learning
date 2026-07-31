const jwt = require("jsonwebtoken");

const isStudent = (req, res, next) => {
  try {
    // GET TOKEN FROM AUTHORIZATION HEADER
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

    // ALLOW ONLY STUDENTS
    if (decoded.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    // STORE USER DATA FOR NEXT MIDDLEWARE / CONTROLLER
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

module.exports = isStudent;
