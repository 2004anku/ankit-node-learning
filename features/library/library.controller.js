const Library = require("./library.model");

const registerLibrary = async (req, res) => {
  const newLibrary = new Library({
    libraryName: req.body.libraryName,
    email: req.body.email,
    password: req.body.password,
  });

  await newLibrary.save();

  res.send("Library Registered");
};

// GET to know about which library are existest
const getLibraries = async (req, res) => {
  const libraries = await Library.find();

  res.send(libraries);
};

module.exports = {
  registerLibrary,
  getLibraries,
};
