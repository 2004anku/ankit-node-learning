const Library = require("./library.model");
const libraryValidationSchema = require("./library.validation");

// CREATE LIBRARY
const registerLibrary = async (req, res) => {
  try {
    const { libraryName, address, city, state, phone, email } = req.body;

    // REQUIRED FIELD VALIDATION
    const { error } = libraryValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // PHONE VALIDATION
    {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    // CREATE LIBRARY
    const newLibrary = await Library.create({
      libraryName,
      address,
      city,
      state,
      phone,
      email,
    });

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
      totalLibraries: libraries.length,
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
    // CHECK EMPTY BODY
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide data to update",
      });
    }

    const updatedLibrary = await Library.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    // CHECK LIBRARY EXISTS
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

    // CHECK LIBRARY EXISTS
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
