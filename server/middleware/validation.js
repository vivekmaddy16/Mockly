const { body, param, validationResult } = require('express-validator');

// ─── Validation Result Handler Middleware ────────────────────
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return res.status(422).json({
      error: 'Validation failed',
      details: extractedErrors,
    });
  }
  next();
};

// ─── Register Validation ─────────────────────────────────────
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  body('targetRole')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Target role must be under 100 characters')
    .escape(),

  body('experienceLevel')
    .optional()
    .trim()
    .isIn(['Entry-Level / Junior', 'Mid-Level (2-4 yrs)', 'Senior (5+ yrs)', 'Lead / Architect'])
    .withMessage('Invalid experience level'),

  handleValidationErrors,
];

// ─── Login Validation ────────────────────────────────────────
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

// ─── Forgot Password Validation ──────────────────────────────
const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  handleValidationErrors,
];

// ─── Reset Password Validation ───────────────────────────────
const validateResetPassword = [
  param('token')
    .notEmpty().withMessage('Reset token is required')
    .isHexadecimal().withMessage('Invalid reset token format'),

  body('password')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  handleValidationErrors,
];

// ─── Change Password Validation ──────────────────────────────
const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  handleValidationErrors,
];

// ─── Profile Update Validation ───────────────────────────────
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
    .escape(),

  body('targetRole')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Target role must be under 100 characters')
    .escape(),

  body('experienceLevel')
    .optional()
    .trim()
    .isIn(['Entry-Level / Junior', 'Mid-Level (2-4 yrs)', 'Senior (5+ yrs)', 'Lead / Architect'])
    .withMessage('Invalid experience level'),

  handleValidationErrors,
];

// ─── Verify Email Token Validation ───────────────────────────
const validateVerifyEmail = [
  param('token')
    .notEmpty().withMessage('Verification token is required')
    .isHexadecimal().withMessage('Invalid verification token format'),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateProfileUpdate,
  validateVerifyEmail,
  handleValidationErrors,
};
