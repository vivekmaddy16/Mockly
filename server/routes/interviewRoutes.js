const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionById,
  updateEvaluation,
  completeSession,
  deleteSession,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.put('/:id/eval', updateEvaluation);
router.put('/:id/complete', completeSession);
router.delete('/:id', deleteSession);

module.exports = router;
