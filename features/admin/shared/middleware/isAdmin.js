const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  // CHECK TOKEN
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    // VERIFY TOKEN
    const decoded = jwt.verify(token, "secretkey123");

    // STORE USER DATA
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: err.message,
    });
  }
};

module.exports = isAdmin;
