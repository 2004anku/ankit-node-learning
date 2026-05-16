const Library = require("./library.model");

// CREATE LIBRARY

const registerLibrary = async (req, res) => {
  try {
    const newLibrary = new Library({
      libraryName: req.body.libraryName,
      ownerName: req.body.ownerName,
      phone: req.body.phone,
      address: req.body.address,
    });

    await newLibrary.save();

    res.send("Library Registered");
  } catch (err) {
    res.status(500).json({
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
// d

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
