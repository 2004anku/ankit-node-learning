const Joi = require("joi");

// ==========================================
// CREATE USER
// ==========================================
const createUserValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string()
    .valid("super-admin", "college-admin", "library-admin", "student")
    .required(),

  phone: Joi.string().pattern(/^\+[1-9]\d{7,14}$/),

  gender: Joi.string().valid("male", "female", "other"),
});

// ==========================================
// UPDATE USER (Super Admin)
// ==========================================
const updateUserValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50),

  email: Joi.string().email(),

  password: Joi.string().min(6),

  phone: Joi.string().pattern(/^\+[1-9]\d{7,14}$/),

  gender: Joi.string().valid("male", "female", "other"),

  role: Joi.string().valid(
    "super-admin",
    "college-admin",
    "library-admin",
    "student",
  ),

  isActive: Joi.boolean(),
});

// ==========================================
// UPDATE PROFILE (Library Admin)
// ==========================================
const updateProfileValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50),

  phone: Joi.string().pattern(/^\+[1-9]\d{7,14}$/),

  gender: Joi.string().valid("male", "female", "other"),
});

module.exports = {
  createUserValidationSchema,
  updateUserValidationSchema,
  updateProfileValidationSchema,
};
