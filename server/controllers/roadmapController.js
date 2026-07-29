const { getRoadmapStep, getUserRoadmapProgress } = require('../models/mysql/RoadmapStep');

// ══════════════════════════════════════════════════════════════
// @desc    Get full roadmap (all categories)
// @route   GET /api/roadmap?category=DSA
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getRoadmap = async (req, res) => {
  try {
    const RoadmapStep = getRoadmapStep();
    if (!RoadmapStep) {
      return res.status(503).json({ error: 'MySQL not available. Roadmap feature requires MySQL.' });
    }

    const filter = { isActive: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const steps = await RoadmapStep.findAll({
      where: filter,
      order: [['category', 'ASC'], ['displayOrder', 'ASC']],
    });

    // Get user progress
    const UserRoadmapProgress = getUserRoadmapProgress();
    let userProgress = [];

    if (UserRoadmapProgress) {
      userProgress = await UserRoadmapProgress.findAll({
        where: { mongoUserId: req.user._id.toString() },
      });
    }

    // Merge progress into steps
    const progressMap = {};
    userProgress.forEach((p) => {
      progressMap[p.roadmapStepId] = {
        isCompleted: p.isCompleted,
        completedAt: p.completedAt,
        notes: p.notes,
      };
    });

    const enrichedSteps = steps.map((step) => ({
      ...step.toJSON(),
      progress: progressMap[step.id] || { isCompleted: false },
    }));

    // Group by category
    const grouped = {};
    enrichedSteps.forEach((step) => {
      if (!grouped[step.category]) {
        grouped[step.category] = [];
      }
      grouped[step.category].push(step);
    });

    res.json({
      roadmap: grouped,
      totalSteps: steps.length,
      completedSteps: userProgress.filter((p) => p.isCompleted).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Get roadmap by category
// @route   GET /api/roadmap/:category
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getRoadmapByCategory = async (req, res) => {
  try {
    const RoadmapStep = getRoadmapStep();
    if (!RoadmapStep) {
      return res.status(503).json({ error: 'MySQL not available' });
    }

    const validCategories = ['DSA', 'OOPs', 'DBMS', 'OS', 'CN', 'System Design'];
    if (!validCategories.includes(req.params.category)) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
    }

    const steps = await RoadmapStep.findAll({
      where: { category: req.params.category, isActive: true },
      order: [['displayOrder', 'ASC']],
    });

    const UserRoadmapProgress = getUserRoadmapProgress();
    let userProgress = [];
    if (UserRoadmapProgress) {
      userProgress = await UserRoadmapProgress.findAll({
        where: { mongoUserId: req.user._id.toString() },
      });
    }

    const progressMap = {};
    userProgress.forEach((p) => {
      progressMap[p.roadmapStepId] = {
        isCompleted: p.isCompleted,
        completedAt: p.completedAt,
        notes: p.notes,
      };
    });

    const enrichedSteps = steps.map((step) => ({
      ...step.toJSON(),
      progress: progressMap[step.id] || { isCompleted: false },
    }));

    res.json({
      category: req.params.category,
      steps: enrichedSteps,
      totalSteps: steps.length,
      completedSteps: enrichedSteps.filter((s) => s.progress.isCompleted).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Mark roadmap step as completed
// @route   PUT /api/roadmap/:id/complete
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.completeStep = async (req, res) => {
  try {
    const UserRoadmapProgress = getUserRoadmapProgress();
    if (!UserRoadmapProgress) {
      return res.status(503).json({ error: 'MySQL not available' });
    }

    const stepId = parseInt(req.params.id, 10);
    const mongoUserId = req.user._id.toString();

    const [progress, created] = await UserRoadmapProgress.findOrCreate({
      where: { mongoUserId, roadmapStepId: stepId },
      defaults: {
        isCompleted: true,
        completedAt: new Date(),
        notes: req.body.notes || null,
      },
    });

    if (!created) {
      // Toggle completion
      progress.isCompleted = !progress.isCompleted;
      progress.completedAt = progress.isCompleted ? new Date() : null;
      if (req.body.notes !== undefined) {
        progress.notes = req.body.notes;
      }
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
