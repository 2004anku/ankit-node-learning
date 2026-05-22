const Joi = require("joi");

const studentValidationSchema = Joi.object({
  studentName: Joi.string().trim().required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  phone: Joi.string().required(),

  course: Joi.string().required(),

  semester: Joi.number().required(),

  fine: Joi.number(),

  status: Joi.string().valid("active", "inactive"),
});

module.exports = studentValidationSchema;
