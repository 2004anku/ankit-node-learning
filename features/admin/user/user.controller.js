const User = require("./user.model");

// CREATE USER
const createUser = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);

    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      gender: req.body.gender,
      role: req.body.role,
    });

    console.log("User object before saving:", user);

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: "All users fetched",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
};

// DELETE USER BY ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting user",
      error: err.message,
    });
  }
};

// UPDATE USER BY ID
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating user",
      error: err.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
