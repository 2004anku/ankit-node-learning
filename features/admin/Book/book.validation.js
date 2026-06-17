const Joi = require("joi");

const createBookValidationSchema = Joi.object({
  bookName: Joi.string().trim().required(),

  author: Joi.string().trim().required(),

  category: Joi.string().trim().required(),

  isbn: Joi.string().min(10).max(13).required().messages({
    "string.min": "ISBN must be at least 10 characters",
    "string.max": "ISBN cannot exceed 13 characters",
  }),

  totalCopies: Joi.number().min(1).required(),

  price: Joi.number().min(0).required(),

  libraryId: Joi.string().required(),
});

const updateBookValidationSchema = Joi.object({
  bookName: Joi.string().trim(),

  author: Joi.string().trim(),

  category: Joi.string().trim(),

  isbn: Joi.string().min(10).max(13).messages({
    "string.min": "ISBN must be at least 10 characters",
    "string.max": "ISBN cannot exceed 13 characters",
  }),

  totalCopies: Joi.number().min(1),

  availableCopies: Joi.number().min(0),

  price: Joi.number().min(0),
});

module.exports = {
  createBookValidationSchema,
  updateBookValidationSchema,
};
