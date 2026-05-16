const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema(
  {
    libraryName: String,
    ownerName: String,
    phone: Number,
    address: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Library", librarySchema);
