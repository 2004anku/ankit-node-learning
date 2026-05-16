const express = require("express");
const connectDB = require("./Config/db");

const libraryRoutes = require("./features/admin/Library/library.routes");
const userRoutes = require("./features/admin/User/user.routes");
const bookRoutes = require("./Features/Admin/Book/book.routes");

const app = express();

connectDB();

app.use(express.json());

// ROUTES
app.use("/admin/libraries", libraryRoutes);
app.use("/admin/users", userRoutes);
app.use("/admin/books", bookRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
