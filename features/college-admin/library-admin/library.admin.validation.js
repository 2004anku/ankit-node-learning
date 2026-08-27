const Joi = require("joi");

// ==========================================
// CREATE LIBRARY ADMIN
// ==========================================

const createLibraryAdminValidationSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().trim().lowercase().required(),

  password: Joi.string().min(6).required(),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be in format like +919876543210",
      "string.empty": "Phone number is required",
    }),

  libraryId: Joi.string().required(),

  isActive: Joi.boolean().default(true),
});

// ==========================================
// UPDATE LIBRARY ADMIN
// ==========================================

const updateLibraryAdminValidationSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50),

  email: Joi.string().email().trim().lowercase(),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be in format like +919876543210",
    }),

  password: Joi.string().min(6),

  libraryId: Joi.string(),

  isActive: Joi.boolean(),
});

module.exports = {
  createLibraryAdminValidationSchema,
  updateLibraryAdminValidationSchema,
};
