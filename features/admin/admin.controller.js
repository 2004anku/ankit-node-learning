const Admin = require("./admin.model.js");
// CREATE(POST)
const createAdmin = async (req, res) => {
  try {
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

// UPDATE
const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({
      message: "Admin Updated Successfully",
      data: updatedAdmin,
    });
  } catch (err) {
    res.send(err);
  }
};

// DELETE
const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    res.json({
      message: "Admin Deleted Successfully",
      data: deletedAdmin,
    });
  } catch (err) {
    res.send(err);
  }
};
module.exports = {
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
};
