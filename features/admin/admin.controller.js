const Admin = require("./admin.model.js");
// CREATE
const createAdmin = async (req, res) => {
  try {
    console.log(req.body);
    const admin = new Admin(req.body);
    await admin.save();
    res.send("Admin created");
  } catch (err) {
    res.send(err);
  }
};

// GET
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  createAdmin,
  getAdmins,
};
