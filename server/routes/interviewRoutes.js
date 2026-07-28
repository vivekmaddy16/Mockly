const express = require('express');
const router = express.Router();
const { createSession, getSessions, getSessionById, updateEvaluation } = require('../controllers/interviewController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createSession);
router.get('/', optionalAuth, getSessions);
router.get('/:id', getSessionById);
router.put('/:id/eval', updateEvaluation);

module.exports = router;
