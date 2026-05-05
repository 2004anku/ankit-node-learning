const express = require("express");
const { handler } = require("./routes");

const server = express();
server.use("/", (req, res, next) => {
  console.log("This always run");
  next();
});

server.use("/message", handler);

server.use("/ankit", (req, res, next) => {
  console.log("In another Middleware !");
  res.send("<h1>Hello Ankit !!</h1>");
});

server.use((req, res, next) => {
  console.log("In another Middleware !");
  res.send("<h1>Hello From Node!!</h1>");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
