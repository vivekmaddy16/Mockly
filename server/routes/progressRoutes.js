const express = require('express');
const router = express.Router();
const { getProgressStats } = require('../controllers/progressController');
const { optionalAuth } = require('../middleware/auth');

router.get('/stats', optionalAuth, getProgressStats);

module.exports = router;
