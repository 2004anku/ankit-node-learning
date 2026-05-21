const Issue = require("./book-circulation.model");
const Book = require("../book/book.model");
const Student = require("../student/student.model");
const { calculateFine } = require("../../../shared/helpers/fine.helper");

// ISSUE BOOK
const issueBook = async (req, res) => {
  try {
    const { studentId, bookId, dueDate } = req.body;

    const today = new Date();
    const selectedDueDate = new Date(dueDate);

    // BUSINESS VALIDATION ONLY
    if (selectedDueDate <= today) {
      return res.status(400).json({
        success: false,
        message: "Due date must be a future date",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book not available",
      });
    }

    const existingIssue = await Issue.findOne({
      studentId,
      bookId,
      status: "issued",
    });

    if (existingIssue) {
      return res.status(400).json({
        success: false,
        message: "Book already issued to this student",
      });
    }

    const issuedBook = await Issue.create({
      studentId,
      bookId,
      dueDate,
    });

    book.availableCopies -= 1;
    await book.save();

    return res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: issuedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while issuing book",
      error: error.message,
    });
  }
};

// GET ALL ISSUED BOOKS
const getAllIssuedBooks = async (req, res) => {
  try {
    const issues = await Issue.find().populate("studentId").populate("bookId");

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

// RETURN BOOK
const returnBook = async (req, res) => {
  try {
    const { issueId } = req.body;

    // VALIDATION
    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: "Issue ID is required",
      });
    }

    // FIND ISSUE RECORD
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // CHECK IF ALREADY RETURNED
    if (issue.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Book already returned",
      });
    }

    // FIND BOOK
    const book = await Book.findById(issue.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const today = new Date();

    const fine = calculateFine(issue.dueDate, today);

    // UPDATE ISSUE RECORD
    issue.returnDate = today;
    issue.status = "returned";
    issue.fine = fine;

    await issue.save();

    // UPDATE STUDENT FINE
    const student = await Student.findById(issue.studentId);

    if (student) {
      // ADD FINE TO STUDENT ACCOUNT
      student.fine = (student.fine || 0) + fine;

      await student.save();
    }

    // INCREASE AVAILABLE COPIES
    book.availableCopies += 1;

    await book.save();

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      totalFine: fine,
      finePaid: issue.finePaid,
      remainingFine: issue.finePaid ? 0 : fine,
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while returning book",
      error: error.message,
    });
  }
};

// COLLECT FINE
const collectFine = async (req, res) => {
  try {
    const { issueId } = req.params;

    // VALIDATION
    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: "Issue ID is required",
      });
    }

    // FIND ISSUE
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // CHECK FINE EXISTS
    if (issue.fine <= 0) {
      return res.status(400).json({
        success: false,
        message: "No fine pending",
      });
    }

    // CHECK ALREADY PAID
    if (issue.finePaid) {
      return res.status(400).json({
        success: false,
        message: "Fine already paid",
      });
    }

    // MARK FINE AS PAID
    issue.finePaid = true;

    await issue.save();

    // UPDATE STUDENT FINE
    const student = await Student.findById(issue.studentId);

    if (student) {
      // REDUCE PAID FINE
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
  issueBook,
  getAllIssuedBooks,
  returnBook,
  collectFine,
};
