const express = require("express");
const connectDB = require("./Config/db");

const libraryRoutes = require("./features/admin/library/library.routes");
const userRoutes = require("./features/admin/user/user.routes");
const bookRoutes = require("./features/admin/book/book.routes");
const authRoutes = require("./features/admin/auth/auth.routes");

const app = express();

connectDB();

app.use(express.json());

// ROUTES
app.use("/admin/auth", authRoutes);
app.use("/admin/libraries", libraryRoutes);
app.use("/admin/users", userRoutes);
app.use("/admin/books", bookRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
