const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter, passwordResetLimiter, emailVerificationLimiter } = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateProfileUpdate,
  validateVerifyEmail,
} = require('../middleware/validation');

// ─── Public Routes ───────────────────────────────────────────
router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/verify-email/:token', emailVerificationLimiter, validateVerifyEmail, verifyEmail);
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, forgotPassword);
router.put('/reset-password/:token', passwordResetLimiter, validateResetPassword, resetPassword);

// ─── Protected Routes ────────────────────────────────────────
router.get('/me', protect, getMe);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validateChangePassword, changePassword);
router.post('/resend-verification', protect, emailVerificationLimiter, resendVerification);

module.exports = router;
