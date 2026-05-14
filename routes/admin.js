const path = require("path");
const express = require("express");
const router = express.Router();

router.use("/", (req, res) => {
  console.log("welcome");
  res.send("Hiii bro you are in admin page");
});
module.exports = router;
