const Joi = require("joi");
const addressValidationSchema = require("../../../shared/schema/address.validation");

const createLibraryValidationSchema = Joi.object({
  collegeId: Joi.string().required(),
  libraryName: Joi.string().trim().required(),

  email: Joi.string().email().trim().lowercase().required(),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be in format like +919876543210",

      "string.empty": "Phone number is required",
    }),

  workingHours: Joi.object({
    open: Joi.string().trim(),

    close: Joi.string().trim(),
  }),

  status: Joi.string()
    .valid("active", "inactive", "suspended")
    .default("active"),

  plan: Joi.string().valid("free", "premium").default("free"),
});

const updateLibraryValidationSchema = Joi.object({
  collegeId: Joi.string(),

  libraryName: Joi.string().trim(),

  email: Joi.string().email().trim().lowercase(),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be in format like +919876543210",
    }),

  workingHours: Joi.object({
    open: Joi.string().trim(),

    close: Joi.string().trim(),
  }),

  status: Joi.string().valid("active", "inactive", "suspended"),

  plan: Joi.string().valid("free", "premium"),
});

module.exports = {
  createLibraryValidationSchema,
  updateLibraryValidationSchema,
};
