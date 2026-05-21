const Joi = require("joi");
// LOGIN VALIDATION
const loginValidation = Joi.object({
  email: Joi.string().email().trim().required(),

  password: Joi.string().required(),
});

module.exports = loginValidation;
