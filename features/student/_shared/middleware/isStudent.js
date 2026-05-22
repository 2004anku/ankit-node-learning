const jwt = require("jsonwebtoken");

const isStudent = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // CHECK TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // CHECK ROLE
    if (decoded.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    // STORE USER DATA
    req.student = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
};

module.exports = isStudent;
