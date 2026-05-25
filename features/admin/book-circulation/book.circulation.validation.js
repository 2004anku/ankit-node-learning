const Joi = require("joi");

// COMMON OBJECT ID VALIDATOR
const objectId = Joi.string()
  .trim()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Invalid MongoDB ObjectId",
  });

// ==========================================
// STUDENT REQUEST BOOK
// ==========================================
const requestBookValidationSchema = Joi.object({
  bookId: objectId.required().messages({
    "any.required": "Book ID is required",
    "string.empty": "Book ID cannot be empty",
  }),
});

// ==========================================
// ADMIN DIRECT ISSUE BOOK
// ==========================================
const issueBookValidationSchema = Joi.object({
  studentId: objectId.required().messages({
    "any.required": "Student ID is required",
    "string.empty": "Student ID cannot be empty",
  }),

  bookId: objectId.required().messages({
    "any.required": "Book ID is required",
    "string.empty": "Book ID cannot be empty",
  }),

  dueDate: Joi.date().greater("now").required().messages({
    "any.required": "Due date is required",
    "date.greater": "Due date must be a future date",
  }),
});

// ==========================================
// ADMIN APPROVE REQUEST
// ==========================================
const approveRequestValidationSchema = Joi.object({
  dueDate: Joi.date().greater("now").required().messages({
    "any.required": "Due date is required",
    "date.greater": "Due date must be a future date",
  }),
});

// ==========================================
// RETURN BOOK REQUEST
// ==========================================
const returnBookValidationSchema = Joi.object({
  issueId: objectId.required().messages({
    "any.required": "Issue ID is required",
  }),
});

// ==========================================
// COLLECT FINE
// ==========================================
const collectFineValidationSchema = Joi.object({
  issueId: objectId.required().messages({
    "any.required": "Issue ID is required",
  }),
});

module.exports = {
  requestBookValidationSchema,
  issueBookValidationSchema,
  approveRequestValidationSchema,
  returnBookValidationSchema,
  collectFineValidationSchema,
};
