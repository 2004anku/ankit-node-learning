const express = require("express"); // by we can import express and use its liberay
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");
const adminRouter = require("./routes/admin");

const app = express();
connectDB();

app.use(express.json());

app.use("/admin", adminRouter);

app.use((req, res) => {
  res.status(404).send("Route not found ❌");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
