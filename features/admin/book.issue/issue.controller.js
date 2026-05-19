const Issue = require("./issue.model");
const Book = require("../book/book.model");
const Student = require("../student/student.model");

// ISSUE BOOK
const issueBook = async (req, res) => {
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

    // CHECK AVAILABLE COPIES
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book not available",
      });
    }

    // CREATE ISSUE ENTRY
    const issuedBook = await Issue.create({
      studentId,
      bookId,
      dueDate,
    });

    // REDUCE AVAILABLE COPIES
    book.availableCopies -= 1;

    await book.save();

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: issuedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL ISSUED BOOKS
const getAllIssuedBooks = async (req, res) => {
  try {
    const issues = await Issue.find().populate("studentId").populate("bookId");

    res.status(200).json({
      success: true,
      total: issues.length,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RETURN BOOK
const returnBook = async (req, res) => {
  try {
    const { issueId } = req.body;

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

    // TODAY DATE
    const today = new Date();

    // DEFAULT FINE
    let fine = 0;

    // DUE DATE
    const dueDate = new Date(issue.dueDate);

    // CHECK LATE RETURN
    if (today > dueDate) {
      // DIFFERENCE IN MILLISECONDS
      const timeDifference = today - dueDate;

      // CONVERT INTO DAYS
      const lateDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      // ₹10 PER DAY
      fine = lateDays * 10;
    }

    // UPDATE ISSUE RECORD
    issue.returnDate = today;
    issue.status = "returned";
    issue.fine = fine;

    await issue.save();

    // UPDATE STUDENT FINE
    const student = await Student.findById(issue.studentId);

    if (student) {
      student.fine += fine;
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
      message: error.message,
    });
  }
};

// COLLECT FINE
const collectFine = async (req, res) => {
  try {
    const { issueId } = req.params;

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
      student.fine -= issue.fine;
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
      message: error.message,
    });
  }
};

module.exports = {
  issueBook,
  getAllIssuedBooks,
  returnBook,
  collectFine,
};
