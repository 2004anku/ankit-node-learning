const User = require("../user/user.model");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// REGISTER CONTROLLER
const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // CHECK USER EXISTS
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error while registering user",
      error: err.message,
    });
  }
};

// LOGIN CONTROLLER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error while login",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
};
