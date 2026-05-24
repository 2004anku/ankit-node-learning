const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // STUDENT REFERENCE
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // BOOK REFERENCE
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    // ISSUE DATE
    // ONLY ADDED WHEN ADMIN APPROVES REQUEST
    issueDate: {
      type: Date,
      default: null,
    },

    // DUE DATE
    // NOT REQUIRED FOR PENDING REQUEST
    dueDate: {
      type: Date,
      default: null,
    },

    // RETURN DATE
    returnDate: {
      type: Date,
      default: null,
    },

    // FINE AMOUNT
    fine: {
      type: Number,
      default: 0,
      min: 0,
    },

    // FINE PAYMENT STATUS
    finePaid: {
      type: Boolean,
      default: false,
    },

    // REQUEST / ISSUE STATUS
    status: {
      type: String,
      enum: ["pending", "issued", "returned", "rejected", "return-pending"],
      default: "pending",
    },

    // OPTIONAL REJECTION REASON
    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// PREVENT DUPLICATE ACTIVE REQUESTS / ISSUES
issueSchema.index(
  {
    studentId: 1,
    bookId: 1,
    status: 1,
  },
  {
    unique: false,
  },
);

module.exports = mongoose.model("Issue", issueSchema);
