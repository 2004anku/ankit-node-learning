// ==========================================
// BOOK IMPORT VALIDATION
// ==========================================

const validateBookRow = (row) => {
  const errors = [];

  const bookName = row["Book Name"]?.toString().trim();
  const author = row["Author"]?.toString().trim();
  const category = row["Category"]?.toString().trim();
  const isbn = row["ISBN"]?.toString().trim();

  const totalCopies = row["Total Copies"];
  const price = row["Price"] ?? row["Price ($)"];

  if (!bookName) errors.push("Book Name is required");

  if (!author) errors.push("Author is required");

  if (!category) errors.push("Category is required");

  if (!isbn) errors.push("ISBN is required");

  if (totalCopies === "" || totalCopies === undefined || totalCopies === null) {
    errors.push("Total Copies is required");
  } else if (isNaN(Number(totalCopies))) {
    errors.push("Total Copies must be a number");
  } else if (Number(totalCopies) <= 0) {
    errors.push("Total Copies must be greater than 0");
  }

  if (price === "" || price === undefined || price === null) {
    errors.push("Price is required");
  } else {
    const cleanedPrice = Number(
      String(price).replace("$", "").replace(/,/g, ""),
    );

    if (isNaN(cleanedPrice)) {
      errors.push("Price must be a valid number");
    } else if (cleanedPrice < 0) {
      errors.push("Price cannot be negative");
    }
  }

  return errors;
};

// ==========================================
// STUDENT IMPORT VALIDATION
// ==========================================

const validateStudentRow = (row) => {
  const errors = [];

  const studentName = row["Student Name"]?.toString().trim();
  const email = row["Email"]?.toString().trim();
  const phone = row["Phone"]?.toString().trim();
  const course = row["Course"]?.toString().trim();
  const semester = row["Semester"];

  if (!studentName) {
    errors.push("Student Name is required");
  }

  if (!email) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      errors.push("Invalid email");
    }
  }

  if (!phone) {
    errors.push("Phone is required");
  } else {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      errors.push("Phone must be 10 digits");
    }
  }

  if (!course) {
    errors.push("Course is required");
  }

  if (semester === "" || semester === undefined || semester === null) {
    errors.push("Semester is required");
  } else if (isNaN(Number(semester))) {
    errors.push("Semester must be a number");
  } else if (Number(semester) <= 0) {
    errors.push("Semester must be greater than 0");
  }

  return errors;
};

module.exports = {
  validateBookRow,
  validateStudentRow,
};
