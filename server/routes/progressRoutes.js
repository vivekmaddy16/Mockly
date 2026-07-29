const express = require('express');
const router = express.Router();
const { getProgressStats, getProgressTrends, trackActivity } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/stats', getProgressStats);
router.get('/trends', getProgressTrends);
router.post('/track', trackActivity);

module.exports = router;
