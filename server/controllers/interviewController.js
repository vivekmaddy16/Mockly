const InterviewSession = require('../models/InterviewSession');

// @desc    Create new interview session
// @route   POST /api/interviews
exports.createSession = async (req, res) => {
  try {
    const { sessionId, targetRole, experienceLevel, resumeText, jobDescriptionText, extractedSkills, questions } = req.body;

    const newSession = await InterviewSession.create({
      sessionId: sessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user: req.user ? req.user._id : undefined,
      targetRole,
      experienceLevel,
      resumeText,
      jobDescriptionText,
      extractedSkills: extractedSkills || [],
      questions: questions || [],
      evaluations: {},
      status: 'in_progress',
    });

    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Get user interview sessions
// @route   GET /api/interviews
exports.getSessions = async (req, res) => {
  try {
    const filter = req.user ? { user: req.user._id } : {};
    const sessions = await InterviewSession.find(filter).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Get session by ID
// @route   GET /api/interviews/:id
exports.getSessionById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ sessionId: req.params.id });
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Update question evaluation in session
// @route   PUT /api/interviews/:id/eval
exports.updateEvaluation = async (req, res) => {
  try {
    const { questionId, evaluation } = req.body;
    const session = await InterviewSession.findOne({ sessionId: req.params.id });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (!session.evaluations) session.evaluations = new Map();
    session.evaluations.set(questionId, evaluation);

    // Calculate updated total score
    const evals = Array.from(session.evaluations.values());
    if (evals.length > 0) {
      session.totalScore = Math.round(evals.reduce((acc, ev) => acc + (ev.score || 0), 0) / evals.length);
    }

    if (evals.length >= session.questions.length) {
      session.status = 'completed';
    }

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
