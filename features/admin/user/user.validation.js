const Joi = require("joi");

const userValidationSchema = Joi.object({
  name: Joi.string().trim().required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string().valid("admin", "librarian").optional(),
});

module.exports = userValidationSchema;
