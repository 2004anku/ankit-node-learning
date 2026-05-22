const Joi = require("joi");

// STUDENT REQUEST BOOK
const requestBookValidationSchema = Joi.object({
  bookId: Joi.string().required().messages({
    "any.required": "Book ID is required",
    "string.empty": "Book ID cannot be empty",
  }),
});

// ADMIN DIRECT ISSUE BOOK
const issueBookValidationSchema = Joi.object({
  studentId: Joi.string().required().messages({
    "any.required": "Student ID is required",
    "string.empty": "Student ID cannot be empty",
  }),

  bookId: Joi.string().required().messages({
    "any.required": "Book ID is required",
    "string.empty": "Book ID cannot be empty",
  }),
});

// ADMIN APPROVE REQUEST
const approveRequestValidationSchema = Joi.object({
  dueDate: Joi.date().required().messages({
    "any.required": "Due date is required",
  }),
});

module.exports = {
  requestBookValidationSchema,
  issueBookValidationSchema,
  approveRequestValidationSchema,
};
