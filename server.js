const express = require("express");

const connectDB = require("./config/db");

const libraryRoutes = require("./features/library/library.routes");
const userRoutes = require("./features/user/user.routes");
const app = express();

connectDB();

app.use(express.json());

app.use("/library", libraryRoutes);
app.use("/user", userRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
