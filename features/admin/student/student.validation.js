const Joi = require("joi");

const studentValidationSchema = Joi.object({
  studentName: Joi.string().trim().required(),

  phone: Joi.string().length(10).required(),

  course: Joi.string().trim().required(),

  semester: Joi.number().min(1).max(8).required(),
});

module.exports = studentValidationSchema;
