const jwt = require("jsonwebtoken");

const isStudent = (req, res, next) => {
  try {
    // GET TOKEN
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // CHECK ROLE
    if (decoded.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    // STORE USER DATA
    req.user = {
      id: decoded.id,
      role: decoded.role,
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
