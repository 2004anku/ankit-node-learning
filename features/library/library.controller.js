const { getAllUsers } = require("../admin/user/user.controller");
const Library = require("./library.model");

// CREATE LIBRARY

const registerLibrary = async (req, res) => {
  const newLibrary = new Library({
    libraryName: req.body.libraryName,
    email: req.body.email,
    password: req.body.password,
  });

  await newLibrary.save();

  res.send("Library Registered");
};

// GET ALL LIBRARIES
const getLibraries = async (req, res) => {
  try {
    const libraries = await Library.find();

    res.status(200).json({
      message: "Libraries fetched successfully",
      data: libraries,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching libraries",
      error: err.message,
    });
  }
};

// DELETE LIBRARY

const deleteLibrary = async (req, res) => {
  try {
    const deletedLibrary = await Library.findByIdAndDelete(req.params.id);

    if (!deletedLibrary) {
      return res.status(404).json({
        message: "Library not found",
      });
    }

    res.status(200).json({
      message: "Library deleted successfully",
      data: deletedLibrary,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting library",
      error: err.message,
    });
  }
};
// UPDATE LIBRARY

const updateLibrary = async (req, res) => {
  try {
    const updatedLibrary = await Library.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedLibrary) {
      return res.status(404).json({
        message: "Library not found",
      });
    }

    res.status(200).json({
      message: "Library updated successfully",
      data: updatedLibrary,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating library",
      error: err.message,
    });
  }
};

module.exports = {
  registerLibrary,
  getLibraries,
  deleteLibrary,
  updateLibrary,
};
