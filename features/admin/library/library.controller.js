const Library = require("./library.model");

// CREATE LIBRARY

const registerLibrary = async (req, res) => {
  try {
    const newLibrary = await Library.create(req.body);

    res.status(201).json({
      success: true,
      message: "Library registered successfully",
      data: newLibrary,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
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
    const id = req.params.id;

    const exists = await Library.findById(id);

    if (!exists) {
      return res.status(404).json({
        message: "Library not found",
      });
    }

    await Library.findByIdAndDelete(id);

    res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
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
