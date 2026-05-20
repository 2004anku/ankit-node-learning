const User = require("./user.model");
const userValidationSchema = require("./user.validation");
// CREATE USER
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // REQUIRED FIELD VALIDATION
    const { error } = userValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // REMOVE PASSWORD FROM RESPONSE
    const userResponse = user.toObject();

    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    // EXCLUDE PASSWORD
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      totalUsers: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    // CHECK EMPTY BODY
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide data to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    // CHECK USER EXISTS
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message,
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select(
      "-password",
    );

    // CHECK USER EXISTS
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
