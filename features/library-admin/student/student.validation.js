const Joi = require("joi");

const createStudentValidationSchema = Joi.object({
  studentName: Joi.string().trim().required(),

  email: Joi.string().email().trim().lowercase().required(),

  password: Joi.string().min(6).required(),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be in format like +919876543210",
    }),

  course: Joi.string().required(),

  semester: Joi.number().required(),

  fine: Joi.number().default(0),

  status: Joi.string().valid("active", "inactive").default("active"),
});

const updateStudentValidationSchema = Joi.object({
  studentName: Joi.string().trim(),

  email: Joi.string().email().trim().lowercase(),

  password: Joi.string().min(6),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be in format like +919876543210",
    }),

  course: Joi.string(),

  semester: Joi.number(),

  fine: Joi.number(),

  status: Joi.string().valid("active", "inactive"),
});

module.exports = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
