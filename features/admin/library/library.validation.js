const Joi = require("joi");

const libraryValidationSchema = Joi.object({
  libraryName: Joi.string().trim().required(),

  address: Joi.string().trim().required(),

  city: Joi.string().trim().required(),

  state: Joi.string().trim().required(),

  phone: Joi.string().length(10).required(),

  email: Joi.string().email().required(),
});

module.exports = libraryValidationSchema;
