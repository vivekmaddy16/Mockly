const express = require('express');
const router = express.Router();
const { getRoadmap, getRoadmapByCategory, completeStep } = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getRoadmap);
router.get('/:category', getRoadmapByCategory);
router.put('/:id/complete', completeStep);

module.exports = router;
