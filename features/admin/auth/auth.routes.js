const express = require("express");
const router = express.Router();

const { login } = require("./auth.controller");

console.log("login:", login);

// Login user
router.post("/login", login);

module.exports = router;
