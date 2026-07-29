const InterviewSession = require('../models/InterviewSession');
const ProgressTracker = require('../models/ProgressTracker');

// ══════════════════════════════════════════════════════════════
// @desc    Get comprehensive progress stats for user
// @route   GET /api/progress/stats
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getProgressStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate stats from all completed sessions
    const [aggregation] = await InterviewSession.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalInterviews: { $sum: 1 },
          avgScore: { $avg: '$totalScore' },
          maxScore: { $max: '$totalScore' },
          minScore: { $min: '$totalScore' },
        },
      },
    ]);

    // Count total questions answered
    const sessions = await InterviewSession.find({ user: userId, status: 'completed' });
    let totalQuestionsAnswered = 0;
    const categoryScores = {};

    sessions.forEach((session) => {
      if (session.evaluations) {
        const evals = Array.from(session.evaluations.values());
        totalQuestionsAnswered += evals.length;

        // Build category-wise scores
        evals.forEach((ev) => {
          const question = session.questions.find((q) => q.id === ev.questionId);
          const cat = question?.category || 'General';

          if (!categoryScores[cat]) {
            categoryScores[cat] = { sum: 0, count: 0 };
          }
          categoryScores[cat].sum += ev.score || 0;
          categoryScores[cat].count += 1;
        });
      }
    });

    // Calculate category averages and determine weak/strong topics
    const finalCategoryScores = {};
    const weakTopics = [];
    const strongTopics = [];

    Object.entries(categoryScores).forEach(([cat, data]) => {
      const avg = data.count > 0 ? Math.round(data.sum / data.count) : 0;
      finalCategoryScores[cat] = avg;
      if (avg < 60) weakTopics.push(cat);
      if (avg >= 80) strongTopics.push(cat);
    });

    // Get recent scores (last 10)
    const recentSessions = await InterviewSession.find({ user: userId, status: 'completed' })
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(10)
      .select('totalScore targetRole createdAt completedAt');

    const recentScores = recentSessions.map((s) => ({
      date: (s.completedAt || s.createdAt).toISOString().split('T')[0],
      score: s.totalScore || 0,
      role: s.targetRole,
    }));

    // Get streak
    const streak = await ProgressTracker.calculateStreak(userId);

    res.json({
      totalInterviews: aggregation?.totalInterviews || 0,
      avgScore: Math.round(aggregation?.avgScore || 0),
      maxScore: aggregation?.maxScore || 0,
      minScore: aggregation?.minScore || 0,
      totalQuestionsAnswered,
      categoryScores: finalCategoryScores,
      weakTopics,
      strongTopics,
      recentScores,
      streak,
      sessionsCount: sessions.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Get performance trends over time
// @route   GET /api/progress/trends?days=30
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getProgressTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = Math.min(parseInt(req.query.days, 10) || 30, 365);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const dailyProgress = await ProgressTracker.find({
      user: userId,
      date: { $gte: startDateStr },
    })
      .sort({ date: 1 })
      .select('date sessionsCompleted questionsAnswered averageScore topicsPracticed');

    // Get session scores over time
    const sessionTrend = await InterviewSession.find({
      user: userId,
      status: 'completed',
      createdAt: { $gte: startDate },
    })
      .sort({ createdAt: 1 })
      .select('totalScore targetRole createdAt completedAt');

    const scoreTrend = sessionTrend.map((s) => ({
      date: (s.completedAt || s.createdAt).toISOString().split('T')[0],
      score: s.totalScore || 0,
      role: s.targetRole,
    }));

    res.json({
      period: `${days} days`,
      dailyProgress,
      scoreTrend,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Track daily practice activity
// @route   POST /api/progress/track
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.trackActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionsAnswered, topicsPracticed, timeSpentMinutes } = req.body;

    const tracker = await ProgressTracker.getOrCreateToday(userId);

    if (questionsAnswered) {
      tracker.questionsAnswered += questionsAnswered;
    }

    if (topicsPracticed && Array.isArray(topicsPracticed)) {
      topicsPracticed.forEach((topic) => {
        if (!tracker.topicsPracticed.includes(topic)) {
          tracker.topicsPracticed.push(topic);
        }
      });
    }

    if (timeSpentMinutes) {
      tracker.timeSpentMinutes += timeSpentMinutes;
    }

    await tracker.save();

    const streak = await ProgressTracker.calculateStreak(userId);

    res.json({
      ...tracker.toObject(),
      streak,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
