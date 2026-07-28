const InterviewSession = require('../models/InterviewSession');

// @desc    Get progress & analytics for user
// @route   GET /api/progress/stats
exports.getProgressStats = async (req, res) => {
  try {
    const filter = req.user ? { user: req.user._id } : {};
    const sessions = await InterviewSession.find(filter);

    const completed = sessions.filter((s) => s.evaluations && s.evaluations.size > 0);

    const totalInterviews = completed.length;
    const avgScore =
      totalInterviews > 0
        ? Math.round(
            completed.reduce((acc, s) => acc + (s.totalScore || 0), 0) / totalInterviews
          )
        : 0;

    let totalQuestionsAnswered = 0;
    completed.forEach((s) => {
      if (s.evaluations) totalQuestionsAnswered += s.evaluations.size;
    });

    res.json({
      totalInterviews,
      avgScore,
      totalQuestionsAnswered,
      sessionsCount: sessions.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
