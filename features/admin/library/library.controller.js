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
      message: "Error registering library",
      error: err.message,
    });
  }
};

// GET ALL LIBRARIES
const getLibraries = async (req, res) => {
  try {
    const libraries = await Library.find();

    res.status(200).json({
      success: true,
      message: "Libraries fetched successfully",
      data: libraries,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching libraries",
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
        success: false,
        message: "Library not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Library updated successfully",
      data: updatedLibrary,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating library",
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
        success: false,
        message: "Library not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Library deleted successfully",
      data: deletedLibrary,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting library",
      error: err.message,
    });
  }
};

module.exports = {
  registerLibrary,
  getLibraries,
  updateLibrary,
  deleteLibrary,
};
