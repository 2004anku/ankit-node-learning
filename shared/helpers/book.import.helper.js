const Book = require("../../features/library-admin/book/book.model");
/**
 * Validate & Prepare Books for Import
 */
const prepareBooksForImport = async ({
  rows,
  libraryId,
  collegeId,
  validateBookRow,
}) => {
  const booksToInsert = [];
  const skippedBooks = [];

  // ============================
  // Remove duplicate ISBNs inside Excel
  // ============================

  const excelISBNs = new Set();

  // ============================
  // Fetch existing ISBNs in one query
  // ============================

  const uploadedISBNs = rows.map((row) => row["ISBN"]).filter(Boolean);

  const existingBooks = await Book.find({
    libraryId,
    isbn: { $in: uploadedISBNs },
  }).select("isbn");

  const existingISBNs = new Set(existingBooks.map((book) => book.isbn));

  // ============================
  // Process every row
  // ============================

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];

    const errors = validateBookRow(row);

    // Validation Errors
    if (errors.length > 0) {
      skippedBooks.push({
        rowNumber: index + 2,
        row,
        errors,
      });

      continue;
    }

    // Duplicate in Excel
    if (excelISBNs.has(row["ISBN"])) {
      skippedBooks.push({
        rowNumber: index + 2,
        row,
        errors: ["Duplicate ISBN found in uploaded Excel"],
      });

      continue;
    }

    excelISBNs.add(row["ISBN"]);

    // Duplicate in Database
    if (existingISBNs.has(row["ISBN"])) {
      skippedBooks.push({
        rowNumber: index + 2,
        row,
        errors: ["ISBN already exists in database"],
      });

      continue;
    }

    booksToInsert.push({
      bookName: row["Book Name"].trim(),

      author: row["Author"].trim(),

      category: row["Category"].trim(),

      isbn: row["ISBN"].trim(),

      totalCopies: Number(row["Total Copies"]),

      availableCopies: Number(row["Total Copies"]),

      price: Number(String(row["Price ($)"]).replace("$", "").replace(",", "")),

      collegeId,

      libraryId,
    });
  }

  return {
    booksToInsert,
    skippedBooks,
  };
};

module.exports = {
  prepareBooksForImport,
};
