const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },

    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    // Not automated libraryId is filled by us (we get the libraryId form Get_Library )
    libraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Library",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Book", bookSchema);
