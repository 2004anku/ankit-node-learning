require("dotenv").config();

const connectDB = require("../config/db");

const Library = require("../features/super-admin/library/library.model");
const Book = require("../features/admin/book/book.model");
const Student = require("../features/admin/student/student.model");
const User = require("../features/admin/useraccount/user.model");

const OLD_LIBRARY_ID = "6a14b657977433fb5f084a28";

const COLLEGE_ID = "6a5bb14384ea3faf18e47586";

const RAHUL_ID = "6a5bbf330ad74dedbe7be31b";

const migrate = async () => {
  try {
    await connectDB();

    // 1. UPDATE LIBRARY

    await Library.findByIdAndUpdate(OLD_LIBRARY_ID, {
      collegeId: COLLEGE_ID,
      libraryHead: "Rahul Sharma",
    });

    console.log("Library updated");

    // 2. UPDATE BOOKS

    await Book.updateMany(
      {
        libraryId: OLD_LIBRARY_ID,
      },
      {
        collegeId: COLLEGE_ID,
      },
    );

    console.log("Books updated");

    // 3. UPDATE STUDENTS

    await Student.updateMany(
      {},
      {
        collegeId: COLLEGE_ID,
        libraryId: OLD_LIBRARY_ID,
      },
    );

    console.log("Students updated");

    // 4. UPDATE RAHUL ADMIN

    await User.findByIdAndUpdate(RAHUL_ID, {
      role: "library-admin",
      collegeId: COLLEGE_ID,
      libraryId: OLD_LIBRARY_ID,
    });

    console.log("Library admin updated");

    console.log("Migration completed");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

migrate();
