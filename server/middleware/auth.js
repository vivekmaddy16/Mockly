const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mockly_super_secret_jwt_key_2026_secure');
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

// Optional auth — attaches req.user if token is present, but doesn't block unauthenticated requests
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mockly_super_secret_jwt_key_2026_secure');
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      /* ignore invalid token in optional mode */
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
