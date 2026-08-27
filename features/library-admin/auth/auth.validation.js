const Joi = require("joi");

const loginValidationSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),

  password: Joi.string().required(),
});

module.exports = {
  loginValidationSchema,
};
