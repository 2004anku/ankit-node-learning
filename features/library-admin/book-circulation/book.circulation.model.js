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

    // ADMIN WHO ISSUED THE BOOK
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ADMIN WHO ACCEPTED THE RETURN
    returnedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ISSUE DATE
    issueDate: {
      type: Date,
      default: null,
    },

    // DUE DATE
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
    libraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Library",
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
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
