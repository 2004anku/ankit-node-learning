const express = require("express");
const router = express.Router();

const adminController = require("./admin.controller.js");

router.post("/create", adminController.createAdmin);
router.get("/all", adminController.getAdmins);

module.exports = router;
