const Joi = require("joi");

const addressValidationSchema = Joi.object({
  street: Joi.string().trim().required(),

  city: Joi.string().trim().required(),

  state: Joi.string().trim().required(),

  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Pincode must be exactly 6 digits",
      "string.empty": "Pincode is required",
    }),

  country: Joi.string().trim().default("India"),
});

module.exports = addressValidationSchema;
