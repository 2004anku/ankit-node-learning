const Joi = require("joi");

const createCollegeAdminValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  collegeId: Joi.string().required(),
});

module.exports = {
  createCollegeAdminValidationSchema,
};
