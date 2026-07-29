const express = require('express');
const router = express.Router();
const { getResumes, getResumeById, createResume, updateResume, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;
