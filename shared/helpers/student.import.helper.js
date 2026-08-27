const Student = require("../../features/library-admin/student/student.model");
const bcrypt = require("bcrypt");
const prepareStudentsForImport = async ({ rows, libraryId, collegeId }) => {
  const studentsToInsert = [];
  const skippedStudents = [];

  const existingStudents = await Student.find({
    libraryId,
  }).select("email phone");

  const emailSet = new Set(
    existingStudents.map((student) => student.email.toLowerCase()),
  );

  const phoneSet = new Set(existingStudents.map((student) => student.phone));

  for (const row of rows) {
    const email = row["Email"]?.trim().toLowerCase();
    const phone = row["Phone"]?.trim();

    if (emailSet.has(email)) {
      skippedStudents.push({
        rowNumber: row.rowNumber,
        row,
        errors: ["Email already exists"],
      });
      continue;
    }

    if (phoneSet.has(phone)) {
      skippedStudents.push({
        rowNumber: row.rowNumber,
        row,
        errors: ["Phone already exists"],
      });
      continue;
    }
    const hashedPassword = await bcrypt.hash("123456", 10);
    studentsToInsert.push({
      studentName: row["Student Name"],
      email,
      phone,
      password: hashedPassword,

      course: row["Course"],
      semester: Number(row["Semester"]),

      collegeId,
      libraryId,
    });

    emailSet.add(email);
    phoneSet.add(phone);
  }

  return {
    studentsToInsert,
    skippedStudents,
  };
};

module.exports = {
  prepareStudentsForImport,
};
