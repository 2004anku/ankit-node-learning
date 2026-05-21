const Joi = require("joi");

// REQUEST BOOK VALIDATION
const requestBookValidation = Joi.object({
  bookId: Joi.string().required(),
});

module.exports = requestBookValidation;
