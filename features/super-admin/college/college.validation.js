const Joi = require("joi");

const addressValidationSchema = require("../../../shared/schema/address.validation");

// ==========================================
// CREATE COLLEGE VALIDATION
// ==========================================

const createCollegeValidationSchema = Joi.object({
  collegeName: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "College name is required",
    "string.min": "College name must be at least 3 characters",
    "string.max": "College name cannot exceed 150 characters",
  }),

  collegeCode: Joi.string().trim().uppercase().required().messages({
    "string.empty": "College code is required",
  }),

  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Invalid email address",
    "string.empty": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be in format like +919876543210",
      "string.empty": "Phone number is required",
    }),

  address: addressValidationSchema.required(),

  website: Joi.string().uri().allow("").optional(),

  establishedYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear()),

  status: Joi.string().valid("active", "inactive").default("active"),
}).unknown(false);

// ==========================================
// UPDATE COLLEGE VALIDATION
// ==========================================

const updateCollegeValidationSchema = Joi.object({
  collegeName: Joi.string().trim().min(3).max(150),

  collegeCode: Joi.string().trim().uppercase(),

  email: Joi.string().email().trim().lowercase(),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be in format like +919876543210",
    }),

  address: addressValidationSchema,

  website: Joi.string().uri().allow("").optional(),

  establishedYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear()),

  status: Joi.string().valid("active", "inactive"),
})
  .min(1)
  .unknown(false);

module.exports = {
  createCollegeValidationSchema,
  updateCollegeValidationSchema,
};
