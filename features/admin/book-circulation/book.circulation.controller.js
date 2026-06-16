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

    // STUDENT ID FROM TOKEN
    const studentId = req.user.id;

    // CHECK BOOK
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // CHECK EXISTING REQUEST OR ISSUE
    const existingRequest = await Issue.findOne({
      studentId,
      bookId,
      status: {
        $in: ["pending", "issued", "return-pending"],
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already exists for this book",
      });
    }

    // CREATE REQUEST
    const request = await Issue.create({
      studentId,
      bookId,
      status: "pending",
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
      .populate("studentId", "studentName")
      .populate("bookId")
      .populate("issuedBy", "studentName")
      .populate("returnedTo", "studentName");

    return res.status(200).json({
      success: true,
      total: requests.length,
      data: requests,
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

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (issue.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be approved",
      });
    }

    const book = await Book.findById(issue.bookId);

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

    const alreadyIssued = await Issue.findOne({
      studentId: issue.studentId,
      bookId: issue.bookId,
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
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // CHECK BOOK
    const book = await Book.findById(bookId);

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
      .populate("studentId", "fullName")
      .populate("bookId")
      .populate("issuedBy", "fullName")
      .populate("returnedTo", "fullName");

    res.status(200).json({
      success: true,
      message: "Issued books fetched successfully",
      total: issues.length,
      data: issues,
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

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // SECURITY CHECK
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
      .populate("studentId", "fullName")
      .populate("bookId")
      .populate("issuedBy", "fullName")
      .populate("returnedTo", "fullName");

    return res.status(200).json({
      success: true,
      total: requests.length,
      data: requests,
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
    const student = await Student.findById(issue.studentId);

    if (student) {
      student.fine = (student.fine || 0) + fine;

      await student.save();
    }

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

    const student = await Student.findById(issue.studentId);

    if (student) {
      student.fine = Math.max((student.fine || 0) - issue.fine, 0);

      await student.save();
    }

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
};
