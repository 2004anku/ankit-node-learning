const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const validate = require("../../../shared/middleware/form.validation");

const { loginValidationSchema } = require("./auth.validation");

// ==========================================
// LOGIN
// ==========================================

router.post("/login", validate(loginValidationSchema), authController.login);

module.exports = router;
