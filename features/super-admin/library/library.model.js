const { required } = require("joi");
const mongoose = require("mongoose");
const addressSchema = require("../../../shared/schema/address.schema");
const librarySchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    libraryName: {
      type: String,
      required: true,
      trim: true,
    },
    libraryHead: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    address: addressSchema,

    workingHours: {
      open: String,
      close: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Library", librarySchema);
