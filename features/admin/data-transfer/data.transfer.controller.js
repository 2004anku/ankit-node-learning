const fs = require("fs");
const ExcelJS = require("exceljs");
const Book = require("../book/book.model");
const Student = require("../student/student.model");

const {
  validateBookRow,
  validateStudentRow,
} = require("./data.transfer.validation");

const {
  readSpreadsheet,
} = require("../../../shared/helpers/spreadsheet.helper");

const {
  prepareBooksForImport,
} = require("../../../shared/helpers/book.import.helper");

const {
  prepareStudentsForImport,
} = require("../../../shared/helpers/student.import.helper");

// ==========================================
// PREVIEW BOOK IMPORT
// ==========================================

const previewBooks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file",
      });
    }

    const rows = readSpreadsheet(req.file.path);

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const preview = rows.map((row, index) => {
      const errors = validateBookRow(row);

      return {
        rowNumber: index + 2,
        data: row,
        errors,
        valid: errors.length === 0,
      };
    });

    return res.status(200).json({
      success: true,
      totalRows: rows.length,
      validRows: preview.filter((row) => row.valid).length,
      invalidRows: preview.filter((row) => !row.valid).length,
      data: preview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error reading Excel",
      error: error.message,
    });
  }
};

// ==========================================
// IMPORT BOOKS
// ==========================================

const importBooks = async (req, res) => {
  try {
    const previewData = req.body.data;

    if (
      !previewData ||
      !Array.isArray(previewData) ||
      previewData.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No books received.",
      });
    }

    // Convert Preview JSON -> Raw Rows
    const rows = previewData
      .filter((item) => item.valid)
      .map((item) => ({
        rowNumber: item.rowNumber,
        ...item.data,
      }));

    const { booksToInsert, skippedBooks } = await prepareBooksForImport({
      rows,
      libraryId: req.user.libraryId,
      collegeId: req.user.collegeId,
      validateBookRow,
    });

    if (booksToInsert.length > 0) {
      await Book.insertMany(booksToInsert);
    }

    return res.status(201).json({
      success: true,
      message: "Books imported successfully.",
      summary: {
        totalRows: previewData.length,
        inserted: booksToInsert.length,
        skipped: skippedBooks.length,
      },
      skippedBooks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error importing books",
      error: error.message,
    });
  }
};
// ==========================================
// EXPORT BOOKS
// ==========================================

const exportBooks = async (req, res) => {
  try {
    const books = await Book.find({
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
      isDeleted: false,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Books");

    worksheet.columns = [
      { header: "Book Name", key: "bookName", width: 30 },
      { header: "Author", key: "author", width: 25 },
      { header: "Category", key: "category", width: 20 },
      { header: "ISBN", key: "isbn", width: 20 },
      { header: "Total Copies", key: "totalCopies", width: 15 },
      { header: "Available Copies", key: "availableCopies", width: 18 },
      { header: "Price", key: "price", width: 15 },
    ];

    books.forEach((book) => worksheet.addRow(book));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=Books.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error exporting books",
      error: error.message,
    });
  }
};

// ==========================================
// PREVIEW STUDENTS
// ==========================================

const previewStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file",
      });
    }

    const rows = readSpreadsheet(req.file.path);

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const preview = rows.map((row, index) => {
      const errors = validateStudentRow(row);

      return {
        rowNumber: index + 2,
        data: row,
        errors,
        valid: errors.length === 0,
      };
    });

    return res.status(200).json({
      success: true,
      totalRows: rows.length,
      validRows: preview.filter((row) => row.valid).length,
      invalidRows: preview.filter((row) => !row.valid).length,
      data: preview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error reading Student Excel",
      error: error.message,
    });
  }
};

// ==========================================
// IMPORT STUDENTS
// ==========================================

const importStudents = async (req, res) => {
  try {
    const previewData = req.body.data;

    if (
      !previewData ||
      !Array.isArray(previewData) ||
      previewData.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No students received.",
      });
    }

    // Convert Preview JSON -> Raw Rows
    const rows = previewData.map((item) => ({
      rowNumber: item.rowNumber,
      ...item.data,
    }));

    const { studentsToInsert, skippedStudents } =
      await prepareStudentsForImport({
        rows,
        libraryId: req.user.libraryId,
        collegeId: req.user.collegeId,
        validateStudentRow,
      });

    if (studentsToInsert.length > 0) {
      await Student.insertMany(studentsToInsert);
    }

    return res.status(201).json({
      success: true,
      message: "Students imported successfully.",
      summary: {
        totalRows: rows.length,
        inserted: studentsToInsert.length,
        skipped: skippedStudents.length,
      },
      skippedStudents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error importing students",
      error: error.message,
    });
  }
};
// ==========================================
// EXPORT STUDENTS
// ==========================================

const exportStudents = async (req, res) => {
  try {
    const students = await Student.find({
      collegeId: req.user.collegeId,
      libraryId: req.user.libraryId,
      isDeleted: false,
    }).select("-password");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    worksheet.columns = [
      { header: "Student Name", key: "studentName", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Course", key: "course", width: 25 },
      { header: "Semester", key: "semester", width: 15 },
      { header: "Fine", key: "fine", width: 12 },
      { header: "Status", key: "status", width: 15 },
    ];

    students.forEach((student) => worksheet.addRow(student));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=Students.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error exporting students",
      error: error.message,
    });
  }
};
module.exports = {
  previewBooks,
  importBooks,
  exportBooks,

  previewStudents,
  importStudents,
  exportStudents,
};
