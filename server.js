const express = require("express");
const connectDB = require("./config/db");

const libraryRoutes = require("./features/admin/library/library.routes");
const userRoutes = require("./features/admin/user/user.routes");

const app = express();

connectDB();

app.use(express.json());

app.use("/admin/library", libraryRoutes);
app.use("/admin/user", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
