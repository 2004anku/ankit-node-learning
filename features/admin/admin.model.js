const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  number: Number,
  crouse: String,
});

module.exports = mongoose.model("Admin", adminSchema);
