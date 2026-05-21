const Joi = require("joi");

const issueValidationSchema = Joi.object({
  studentId: Joi.string().required(),
  bookId: Joi.string().required(),
  dueDate: Joi.date().required(),
});

module.exports = issueValidationSchema;
