const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail, getVerificationEmailHTML, getPasswordResetEmailHTML } = require('../utils/sendEmail');

// ─── Token Generators ────────────────────────────────────────
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

// Parse duration string to milliseconds
const parseDuration = (duration) => {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (multipliers[unit] || 86400000);
};

// Set refresh token as httpOnly cookie
const setRefreshTokenCookie = (res, refreshToken) => {
  const maxAge = parseDuration(process.env.JWT_REFRESH_EXPIRE || '7d');
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
    maxAge,
    path: '/api/auth',
  });
};

// Clear refresh token cookie helper
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    path: '/api/auth',
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
  });
};

// ══════════════════════════════════════════════════════════════
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ══════════════════════════════════════════════════════════════
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      targetRole: targetRole || 'Full Stack Web Developer',
      experienceLevel: experienceLevel || 'Mid-Level (2-4 yrs)',
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: '✅ Mockly — Verify Your Email Address',
        html: getVerificationEmailHTML(user.name, verificationUrl),
        text: `Welcome to Mockly, ${user.name}! Verify your email by visiting: ${verificationUrl}`,
      });
    } catch (emailErr) {
      console.warn('⚠️ Email sending failed:', emailErr.message);
      // Don't fail registration if email fails
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    const refreshExpiry = parseDuration(process.env.JWT_REFRESH_EXPIRE || '7d');
    user.refreshTokens.push({
      token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
      expiresAt: new Date(Date.now() + refreshExpiry),
      userAgent: req.headers['user-agent'] || '',
    });
    await user.save({ validateBeforeSave: false });

    // Set cookie
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
      isEmailVerified: user.isEmailVerified,
      token: accessToken,
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
// ══════════════════════════════════════════════════════════════
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +loginAttempts +lockUntil'
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.isLocked) {
      const remainingMs = user.lockUntil - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return res.status(423).json({
        error: `Account is locked due to too many failed attempts. Try again in ${remainingMin} minute(s).`,
        code: 'ACCOUNT_LOCKED',
        lockUntil: user.lockUntil,
      });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await user.handleFailedLogin();
      const attemptsRemaining = Math.max(0, 5 - user.loginAttempts);
      return res.status(401).json({
        error: `Invalid email or password. ${attemptsRemaining > 0 ? `${attemptsRemaining} attempt(s) remaining.` : 'Account has been locked for 30 minutes.'}`,
      });
    }

    // Successful login — reset attempts
    await user.handleSuccessfulLogin();

    // Clean expired refresh tokens
    user.cleanExpiredRefreshTokens();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token (max 5 devices)
    const refreshExpiry = parseDuration(process.env.JWT_REFRESH_EXPIRE || '7d');
    user.refreshTokens.push({
      token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
      expiresAt: new Date(Date.now() + refreshExpiry),
      userAgent: req.headers['user-agent'] || '',
    });

    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save({ validateBeforeSave: false });

    // Set cookie
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Refresh access token using refresh token cookie
// @route   POST /api/auth/refresh-token
// @access  Public (with cookie)
// ══════════════════════════════════════════════════════════════
exports.refreshToken = async (req, res) => {
  try {
    const existingRefreshToken = req.cookies.refreshToken;

    if (!existingRefreshToken) {
      return res.status(401).json({ error: 'No refresh token provided', code: 'NO_REFRESH_TOKEN' });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(existingRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify the token exists in user's stored tokens
    const hashedToken = crypto.createHash('sha256').update(existingRefreshToken).digest('hex');
    const storedTokenIndex = user.refreshTokens.findIndex(
      (rt) => rt.token === hashedToken && rt.expiresAt > new Date()
    );

    if (storedTokenIndex === -1) {
      // Token reuse detected — potential theft. Invalidate ALL refresh tokens.
      user.refreshTokens = [];
      await user.save({ validateBeforeSave: false });
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        error: 'Refresh token reuse detected. All sessions have been invalidated for security.',
        code: 'TOKEN_REUSE_DETECTED',
      });
    }

    // ─── Token Rotation: Remove old token, issue new pair ────
    user.refreshTokens.splice(storedTokenIndex, 1);

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    const refreshExpiry = parseDuration(process.env.JWT_REFRESH_EXPIRE || '7d');
    user.refreshTokens.push({
      token: crypto.createHash('sha256').update(newRefreshToken).digest('hex'),
      expiresAt: new Date(Date.now() + refreshExpiry),
      userAgent: req.headers['user-agent'] || '',
    });

    user.cleanExpiredRefreshTokens();
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      token: newAccessToken,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
      isEmailVerified: user.isEmailVerified,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Logout — Clear refresh token
// @route   POST /api/auth/logout
// @access  Public
// ══════════════════════════════════════════════════════════════
exports.logoutUser = async (req, res) => {
  try {
    const existingRefreshToken = req.cookies.refreshToken;

    if (existingRefreshToken) {
      try {
        const decoded = jwt.verify(existingRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
          const hashedToken = crypto.createHash('sha256').update(existingRefreshToken).digest('hex');
          user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== hashedToken);
          await user.save({ validateBeforeSave: false });
        }
      } catch {
        /* token might be expired — clear cookie anyway */
      }
    }

    clearRefreshTokenCookie(res);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
// ══════════════════════════════════════════════════════════════
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: '✅ Mockly — Verify Your Email Address',
      html: getVerificationEmailHTML(user.name, verificationUrl),
      text: `Verify your email: ${verificationUrl}`,
    });

    res.json({ message: 'Verification email sent!' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
// ══════════════════════════════════════════════════════════════
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: '🔐 Mockly — Password Reset Request',
        html: getPasswordResetEmailHTML(user.name, resetUrl),
        text: `Reset your password: ${resetUrl} (expires in 10 minutes)`,
      });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ error: 'Email could not be sent. Please try again later.' });
    }

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Reset password with token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
// ══════════════════════════════════════════════════════════════
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Invalidate all refresh tokens (security: password changed)
    user.refreshTokens = [];
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    clearRefreshTokenCookie(res);
    res.json({ message: 'Password reset successful! Please login with your new password.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Change password (when logged in)
// @route   PUT /api/auth/change-password
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = req.body.newPassword;

    // Invalidate all OTHER refresh tokens (keep current session)
    const currentRefreshToken = req.cookies.refreshToken;
    if (currentRefreshToken) {
      const currentHashed = crypto.createHash('sha256').update(currentRefreshToken).digest('hex');
      user.refreshTokens = user.refreshTokens.filter((rt) => rt.token === currentHashed);
    } else {
      user.refreshTokens = [];
    }

    await user.save();

    res.json({ message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = req.body.name || user.name;
    user.targetRole = req.body.targetRole || user.targetRole;
    user.experienceLevel = req.body.experienceLevel || user.experienceLevel;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      targetRole: updatedUser.targetRole,
      experienceLevel: updatedUser.experienceLevel,
      avatar: updatedUser.avatar,
      isEmailVerified: updatedUser.isEmailVerified,
      token: generateAccessToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
