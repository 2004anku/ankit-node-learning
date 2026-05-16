const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,

    email: String,

    phone: String,

    age: Number,

    gender: String,

    role: String,

    salary: Number,

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
