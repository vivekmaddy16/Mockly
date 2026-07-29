require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { globalLimiter } = require('./middleware/rateLimiter');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

// ─── Connect to MongoDB ──────────────────────────────────────────
connectDB();

// ─── Security Middleware ─────────────────────────────────────────
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", process.env.CLIENT_URL || 'http://localhost:3000'],
  },
}));

// ─── CORS Configuration ─────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsers & Cookies ─────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Global Rate Limiter ────────────────────────────────────────
app.use('/api', globalLimiter);

// ─── Request Logger (dev only) ──────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/progress', progressRoutes);

// ─── MySQL Routes (Optional — loaded only if MySQL is configured) ─
const loadMySQLRoutes = async () => {
  try {
    if (process.env.MYSQL_HOST && process.env.MYSQL_DATABASE) {
      const roadmapRoutes = require('./routes/roadmapRoutes');
      const resumeRoutes = require('./routes/resumeRoutes');
      app.use('/api/roadmap', roadmapRoutes);
      app.use('/api/resumes', resumeRoutes);
      console.log('📦 MySQL routes loaded (roadmap, resumes)');
    }
  } catch (err) {
    console.warn('⚠️  MySQL routes skipped:', err.message);
  }
};
loadMySQLRoutes();

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mockly API Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('🔥 Unhandled Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation Error', details: messages });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `Duplicate value for ${field}` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start Server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Mockly Express Server running on port ${PORT}`);
    console.log(`📡 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    console.log(`🛡️  Security: Helmet + Rate Limiting + CORS active`);
  });
}

module.exports = app;
