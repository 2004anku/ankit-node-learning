const path = require("path");
const express = require("express"); // by we can import express and use its liberay
const bodyParser = require("body-parser");

const app = express();

const adminRouters = require("./routes/admin");
const shopRouters = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRouters);
app.use(shopRouters);

app.use("/", (req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
