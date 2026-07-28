const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mockly_super_secret_jwt_key_2026_secure', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      targetRole: targetRole || 'Full Stack Web Developer',
      experienceLevel: experienceLevel || 'Mid-Level (2-4 yrs)',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = req.body.name || user.name;
    user.targetRole = req.body.targetRole || user.targetRole;
    user.experienceLevel = req.body.experienceLevel || user.experienceLevel;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      targetRole: updatedUser.targetRole,
      experienceLevel: updatedUser.experienceLevel,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
