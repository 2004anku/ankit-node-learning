const Issue = require("./book.circulation.model");
const Book = require("../book/book.model");
const Student = require("../student/student.model");
const { calculateFine } = require("../../../shared/helpers/fine.helper");

// ==========================================
// STUDENT REQUEST BOOK
// ==========================================
const requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    // CHECK BOOK ID
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    // FIND STUDENT
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // FIND BOOK
    const book = await Book.findOne({
      _id: bookId,
      collegeId: student.collegeId,
      isDeleted: false,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // CHECK BOOK AVAILABILITY
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is currently unavailable",
      });
    }

    // CHECK FOR EXISTING ACTIVE REQUEST
    const existingRequest = await Issue.findOne({
      studentId: student._id,
      bookId,
      status: {
        $in: ["pending", "issued", "return-pending"],
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have an active request for this book",
      });
    }

    // CREATE BOOK REQUEST
    const request = await Issue.create({
      studentId: student._id,
      bookId,
      status: "pending",
      collegeId: student.collegeId,
      libraryId: book.libraryId,
    });

    return res.status(201).json({
      success: true,
      message: "Book request sent successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while requesting book",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN GET ALL PENDING REQUESTS
// ==========================================
const getAllBookRequests = async (req, res) => {
  try {
    const requests = await Issue.find()
      .populate({
        path: "studentId",
        match: {
          collegeId: req.user.collegeId,
          libraryId: req.user.libraryId,
        },
        select: "studentName",
      })
      .populate({
        path: "bookId",
        match: {
          collegeId: req.user.collegeId,
          libraryId: req.user.libraryId,
        },
      })
      .populate("issuedBy", "fullName")
      .populate("returnedTo", "fullName");

    const filteredRequests = requests.filter(
      (request) => request.studentId && request.bookId,
    );

    return res.status(200).json({
      success: true,
      total: filteredRequests.length,
      data: filteredRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching requests",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN APPROVE REQUEST
// ==========================================
const approveRequest = async (req, res) => {
  try {
    const { issueId } = req.params;

    // CHECK ISSUE BELONGS TO THIS LIBRARY
    const issue = await Issue.findOne({
      _id: issueId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // CHECK STUDENT BELONGS TO THIS LIBRARY
    const student = await Student.findOne({
      _id: issue.studentId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this request",
      });
    }

    if (issue.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be approved",
      });
    }

    // CHECK BOOK BELONGS TO THIS LIBRARY
    const book = await Book.findOne({
      _id: issue.bookId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      issue.status = "rejected";

      await issue.save();

      return res.status(400).json({
        success: false,
        message: "Book not available. Request rejected automatically.",
      });
    }

    if (student.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Student is inactive",
      });
    }

    // CHECK IF ALREADY ISSUED
    const alreadyIssued = await Issue.findOne({
      studentId: issue.studentId,
      bookId: issue.bookId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
      status: "issued",
    });

    if (alreadyIssued) {
      issue.status = "rejected";

      await issue.save();

      return res.status(400).json({
        success: false,
        message: "Book already issued to student",
      });
    }

    // CREATE DUE DATE
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 90);

    // UPDATE ISSUE
    issue.status = "issued";
    issue.issueDate = new Date();
    issue.dueDate = dueDate;
    issue.issuedBy = req.user.id;

    await issue.save();

    // REDUCE BOOK COPIES
    book.availableCopies -= 1;
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book request approved successfully",
      data: issue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while approving request",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN REJECT REQUEST
// ==========================================
const rejectRequest = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const student = await Student.findOne({
      _id: issue.studentId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (issue.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be rejected",
      });
    }

    issue.status = "rejected";

    await issue.save();

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      data: issue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while rejecting request",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN ASSIGN BOOK TO STUDENT
// ==========================================
const assignBookToStudent = async (req, res) => {
  try {
    const { studentId, bookId, dueDate } = req.body;

    // CHECK STUDENT
    const student = await Student.findOne({
      _id: studentId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    // CHECK STUDENT ACTIVE OR NOT
    if (student.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Cannot assign book to inactive student",
      });
    }
    // CHECK BOOK
    const book = await Book.findOne({
      _id: bookId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // CHECK BOOK AVAILABILITY
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book not available",
      });
    }

    // PREVENT DUPLICATE ACTIVE ISSUES
    const existingIssue = await Issue.findOne({
      studentId,
      bookId,
      status: {
        $in: ["issued", "return-pending"],
      },
    });

    if (existingIssue) {
      return res.status(400).json({
        success: false,
        message: "This student already has this book",
      });
    }

    // CALCULATE DUE DATE
    let finalDueDate;

    if (dueDate) {
      finalDueDate = new Date(dueDate);

      if (finalDueDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Due date must be a future date",
        });
      }
    } else {
      finalDueDate = new Date();

      // DEFAULT: 90 DAYS
      finalDueDate.setDate(finalDueDate.getDate() + 90);
    }

    // CREATE ISSUE RECORD
    const assignedBook = await Issue.create({
      studentId,
      bookId,
      issueDate: new Date(),
      dueDate: finalDueDate,
      status: "issued",
      issuedBy: req.user.id,

      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    // REDUCE AVAILABLE COPIES
    book.availableCopies -= 1;

    await book.save();

    return res.status(201).json({
      success: true,
      message: "Book assigned successfully",
      data: assignedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while assigning book",
      error: error.message,
    });
  }
};
// ==========================================
// GET ALL ISSUED BOOKS
// ==========================================
const getAllIssuedBooks = async (req, res) => {
  try {
    const issues = await Issue.find({
      status: "issued",
    })
      .populate({
        path: "studentId",
        match: {
          collegeId: req.user.collegeId,
          libraryId: req.user.libraryId,
        },
        select: "studentName",
      })
      .populate({
        path: "bookId",
        match: {
          collegeId: req.user.collegeId,
          libraryId: req.user.libraryId,
        },
      })
      .populate("issuedBy", "fullName")
      .populate("returnedTo", "fullName");

    const filteredIssues = issues.filter(
      (issue) => issue.studentId && issue.bookId,
    );

    res.status(200).json({
      success: true,
      message: "Issued books fetched successfully",
      total: filteredIssues.length,
      data: filteredIssues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching issued books",
      error: error.message,
    });
  }
};
// ==========================================
// STUDENT RETURN REQUEST
// ==========================================
const returnBookRequest = async (req, res) => {
  try {
    const { issueId } = req.params;

    const studentId = req.user.id;

    // FIND ISSUE ONLY FROM CURRENT COLLEGE & LIBRARY
    const issue = await Issue.findOne({
      _id: issueId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // VERIFY STUDENT OWNS THIS ISSUE
    if (issue.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ONLY ISSUED BOOK CAN BE RETURNED
    if (issue.status !== "issued") {
      return res.status(400).json({
        success: false,
        message: "Only issued books can be returned",
      });
    }

    // UPDATE STATUS
    issue.status = "return-pending";

    await issue.save();

    return res.status(200).json({
      success: true,
      message: "Return request sent successfully",
      data: issue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while sending return request",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN GET RETURN REQUESTS
// ==========================================
const getReturnRequests = async (req, res) => {
  try {
    const requests = await Issue.find({
      status: "return-pending",
    })
      .populate({
        path: "studentId",
        match: {
          collegeId: req.user.collegeId,
          libraryId: req.user.libraryId,
        },
        select: "studentName",
      })
      .populate({
        path: "bookId",
        match: {
          collegeId: req.user.collegeId,
          libraryId: req.user.libraryId,
        },
      })
      .populate("issuedBy", "fullName")
      .populate("returnedTo", "fullName");

    const filteredRequests = requests.filter(
      (request) => request.studentId && request.bookId,
    );

    return res.status(200).json({
      success: true,
      message: "Return requests fetched successfully",
      total: filteredRequests.length,
      data: filteredRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching return requests",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN ACCEPT RETURN REQUEST
// ==========================================
const acceptReturnRequest = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);
    const student = await Student.findOne({
      _id: issue.studentId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    if (issue.status !== "return-pending") {
      return res.status(400).json({
        success: false,
        message: "No return request pending",
      });
    }

    const book = await Book.findById(issue.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const today = new Date();

    const fine = calculateFine(issue.dueDate, today);

    // UPDATE ISSUE
    issue.returnDate = today;
    issue.status = "returned";
    issue.fine = fine;
    issue.returnedTo = req.user.id;

    await issue.save();
    // UPDATE STUDENT FINE
    student.fine = (student.fine || 0) + fine;

    await student.save();

    // INCREASE BOOK COPIES
    book.availableCopies += 1;

    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book returned successfully",
      totalFine: fine,
      remainingFine: fine,
      data: issue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while accepting return request",
      error: error.message,
    });
  }
};

// ==========================================
// COLLECT FINE
// ==========================================
const collectFine = async (req, res) => {
  try {
    const { issueId } = req.params;

    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: "Issue ID is required",
      });
    }

    const issue = await Issue.findById(issueId);
    const student = await Student.findOne({
      _id: issue.studentId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    if (issue.fine <= 0) {
      return res.status(400).json({
        success: false,
        message: "No fine pending",
      });
    }

    if (issue.finePaid) {
      return res.status(400).json({
        success: false,
        message: "Fine already paid",
      });
    }

    issue.finePaid = true;

    await issue.save();

    student.fine = Math.max((student.fine || 0) - issue.fine, 0);

    await student.save();

    res.status(200).json({
      success: true,
      message: "Fine collected successfully",
      totalFine: issue.fine,
      paidFine: issue.fine,
      remainingFine: 0,
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while collecting fine",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN UPDATE REQUEST STATUS
// ==========================================
const updateRequestStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status } = req.body;

    const issue = await Issue.findById(issueId);
    const student = await Student.findOne({
      _id: issue.studentId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const oldStatus = issue.status;

    // APPROVED -> REJECTED
    if (oldStatus === "issued" && status === "rejected") {
      const book = await Book.findById(issue.bookId);

      if (book) {
        book.availableCopies += 1;
        await book.save();
      }

      issue.status = "rejected";
      issue.issueDate = null;
      issue.dueDate = null;

      await issue.save();
    }

    // REJECTED -> APPROVED
    else if (oldStatus === "rejected" && status === "issued") {
      const book = await Book.findById(issue.bookId);

      if (!book || book.availableCopies <= 0) {
        return res.status(400).json({
          success: false,
          message: "Book not available",
        });
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 90);

      book.availableCopies -= 1;
      await book.save();

      issue.status = "issued";
      issue.issueDate = new Date();
      issue.dueDate = dueDate;
      issue.issuedBy = req.user.id;

      await issue.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid status change",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: issue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating request",
      error: error.message,
    });
  }
};
// ==========================================
// DELETE REJECTED REQUEST
// ==========================================
const deleteRejectedRequest = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);
    const student = await Student.findOne({
      _id: issue.studentId,
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (issue.status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Only rejected requests can be deleted",
      });
    }

    await Issue.findByIdAndDelete(issueId);

    return res.status(200).json({
      success: true,
      message: "Rejected request deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting request",
      error: error.message,
    });
  }
};
module.exports = {
  requestBook,
  getAllBookRequests,
  approveRequest,
  rejectRequest,
  assignBookToStudent,
  getAllIssuedBooks,
  returnBookRequest,
  getReturnRequests,
  acceptReturnRequest,
  collectFine,
  updateRequestStatus,
  deleteRejectedRequest,
};
