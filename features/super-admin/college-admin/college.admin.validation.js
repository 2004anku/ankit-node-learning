const Joi = require("joi");

// ==========================================
// CREATE COLLEGE ADMIN
// ==========================================

const createCollegeAdminValidationSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().trim().lowercase().required(),

  password: Joi.string().min(6).required(),

  phone: Joi.string().trim().required(),

  collegeId: Joi.string().required(),
});

// ==========================================
// UPDATE COLLEGE ADMIN
// ==========================================

const updateCollegeAdminValidationSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50),

  email: Joi.string().email().trim().lowercase(),

  phone: Joi.string().trim(),

  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  createCollegeAdminValidationSchema,
  updateCollegeAdminValidationSchema,
};
