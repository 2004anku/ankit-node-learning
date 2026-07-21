const Joi = require("joi");

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  loginValidationSchema,
};
