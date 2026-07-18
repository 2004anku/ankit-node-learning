const mongoose = require("mongoose");

const addressSchema = require("../../../shared/schema/address.schema");

const collegeSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    collegeName: {
      type: String,
      required: true,
      trim: true,
    },

    collegeCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // ==========================================
    // CONTACT INFORMATION
    // ==========================================

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
      trim: true,
    },

    address: addressSchema,

    website: {
      type: String,
      default: "",
      trim: true,
    },

    establishedYear: {
      type: Number,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // ==========================================
    // SAAS FIELDS
    // ==========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("College", collegeSchema);
