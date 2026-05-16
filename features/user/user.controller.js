const User = require("./user.model");

// CREATE USER
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);

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

// GET
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
};

// DELETE
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.send("User deleted successfully");
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
};
