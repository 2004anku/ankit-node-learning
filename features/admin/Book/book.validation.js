const Joi = require("joi");

const bookValidationSchema = Joi.object({
  bookName: Joi.string().trim().required(),

  author: Joi.string().trim().required(),

  category: Joi.string().trim().required(),

  isbn: Joi.string().min(10).max(13).required(),

  totalCopies: Joi.number().min(1).required(),

  price: Joi.number().min(0).required(),

  libraryId: Joi.string().required(),
});

module.exports = bookValidationSchema;
