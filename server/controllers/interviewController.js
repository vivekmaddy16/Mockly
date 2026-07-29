const InterviewSession = require('../models/InterviewSession');
const ProgressTracker = require('../models/ProgressTracker');

// ══════════════════════════════════════════════════════════════
// @desc    Create new interview session
// @route   POST /api/interviews
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.createSession = async (req, res) => {
  try {
    const {
      sessionId,
      targetRole,
      experienceLevel,
      resumeText,
      jobDescriptionText,
      extractedSkills,
      questions,
    } = req.body;

    const newSession = await InterviewSession.create({
      sessionId: sessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user: req.user._id,
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

// ══════════════════════════════════════════════════════════════
// @desc    Get user interview sessions (paginated)
// @route   GET /api/interviews?page=1&limit=10&status=completed
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    // Optional status filter
    if (req.query.status && ['in_progress', 'completed', 'abandoned'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const [sessions, total] = await Promise.all([
      InterviewSession.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-resumeText -jobDescriptionText'),
      InterviewSession.countDocuments(filter),
    ]);

    res.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Get session by ID
// @route   GET /api/interviews/:id
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getSessionById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      sessionId: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Update question evaluation in session
// @route   PUT /api/interviews/:id/eval
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.updateEvaluation = async (req, res) => {
  try {
    const { questionId, evaluation } = req.body;
    const session = await InterviewSession.findOne({
      sessionId: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (!session.evaluations) session.evaluations = new Map();
    session.evaluations.set(questionId, evaluation);

    // Calculate updated total score
    const evals = Array.from(session.evaluations.values());
    if (evals.length > 0) {
      session.totalScore = Math.round(
        evals.reduce((acc, ev) => acc + (ev.score || 0), 0) / evals.length
      );
    }

    // Auto-complete session if all questions evaluated
    if (evals.length >= session.questions.length) {
      session.status = 'completed';
      session.completedAt = new Date();
    }

    await session.save();

    // Track daily progress
    try {
      const tracker = await ProgressTracker.getOrCreateToday(req.user._id);
      tracker.questionsAnswered += 1;
      const cat = session.questions.find((q) => q.id === questionId)?.category;
      if (cat && !tracker.topicsPracticed.includes(cat)) {
        tracker.topicsPracticed.push(cat);
      }
      await tracker.save();
    } catch (trackErr) {
      console.warn('⚠️ Progress tracking failed:', trackErr.message);
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Complete interview session with overall feedback
// @route   PUT /api/interviews/:id/complete
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.completeSession = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      sessionId: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const { overallFeedback } = req.body;

    session.status = 'completed';
    session.completedAt = new Date();

    if (overallFeedback) {
      session.overallFeedback = overallFeedback;
    }

    // Recalculate final score
    const evals = Array.from(session.evaluations.values());
    if (evals.length > 0) {
      session.totalScore = Math.round(
        evals.reduce((acc, ev) => acc + (ev.score || 0), 0) / evals.length
      );
    }

    await session.save();

    // Update daily progress tracker
    try {
      const tracker = await ProgressTracker.getOrCreateToday(req.user._id);
      tracker.sessionsCompleted += 1;
      tracker.averageScore = session.totalScore || 0;
      await tracker.save();
    } catch (trackErr) {
      console.warn('⚠️ Progress tracking failed:', trackErr.message);
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Delete interview session
// @route   DELETE /api/interviews/:id
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.deleteSession = async (req, res) => {
  try {
    const session = await InterviewSession.findOneAndDelete({
      sessionId: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    res.json({ message: 'Interview session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
