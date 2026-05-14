const express = require("express"); // by we can import express and use its liberay

const { connectDB } = require("./config/db");

const adminRouter = require("./features/admin/admin.routes");

const app = express();

connectDB();

app.use(express.json());

app.use("/admin", adminRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
