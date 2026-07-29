const { getResumeVersionSQL } = require('../models/mysql/ResumeVersionSQL');

// ══════════════════════════════════════════════════════════════
// @desc    Get all resume versions for user
// @route   GET /api/resumes
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getResumes = async (req, res) => {
  try {
    const ResumeVersion = getResumeVersionSQL();
    if (!ResumeVersion) {
      return res.status(503).json({ error: 'MySQL not available. Resume versioning requires MySQL.' });
    }

    const resumes = await ResumeVersion.findAll({
      where: { mongoUserId: req.user._id.toString(), isActive: true },
      order: [['version', 'DESC']],
    });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.getResumeById = async (req, res) => {
  try {
    const ResumeVersion = getResumeVersionSQL();
    if (!ResumeVersion) {
      return res.status(503).json({ error: 'MySQL not available' });
    }

    const resume = await ResumeVersion.findOne({
      where: {
        id: parseInt(req.params.id, 10),
        mongoUserId: req.user._id.toString(),
      },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Create new resume version
// @route   POST /api/resumes
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.createResume = async (req, res) => {
  try {
    const ResumeVersion = getResumeVersionSQL();
    if (!ResumeVersion) {
      return res.status(503).json({ error: 'MySQL not available' });
    }

    const mongoUserId = req.user._id.toString();

    // Auto-increment version number
    const latestResume = await ResumeVersion.findOne({
      where: { mongoUserId },
      order: [['version', 'DESC']],
    });

    const nextVersion = latestResume ? latestResume.version + 1 : 1;

    const resume = await ResumeVersion.create({
      mongoUserId,
      version: nextVersion,
      title: req.body.title || `Resume v${nextVersion}`,
      resumeText: req.body.resumeText,
      targetRole: req.body.targetRole || null,
      sections: req.body.sections || {},
      parsedSkills: req.body.parsedSkills || [],
      atsScore: req.body.atsScore || null,
      atsAnalysis: req.body.atsAnalysis || null,
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Update resume version
// @route   PUT /api/resumes/:id
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.updateResume = async (req, res) => {
  try {
    const ResumeVersion = getResumeVersionSQL();
    if (!ResumeVersion) {
      return res.status(503).json({ error: 'MySQL not available' });
    }

    const resume = await ResumeVersion.findOne({
      where: {
        id: parseInt(req.params.id, 10),
        mongoUserId: req.user._id.toString(),
      },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const allowedFields = ['title', 'resumeText', 'targetRole', 'sections', 'parsedSkills', 'atsScore', 'atsAnalysis'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        resume[field] = req.body[field];
      }
    });

    await resume.save();
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ══════════════════════════════════════════════════════════════
// @desc    Delete resume version (soft delete)
// @route   DELETE /api/resumes/:id
// @access  Private
// ══════════════════════════════════════════════════════════════
exports.deleteResume = async (req, res) => {
  try {
    const ResumeVersion = getResumeVersionSQL();
    if (!ResumeVersion) {
      return res.status(503).json({ error: 'MySQL not available' });
    }

    const resume = await ResumeVersion.findOne({
      where: {
        id: parseInt(req.params.id, 10),
        mongoUserId: req.user._id.toString(),
      },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Soft delete
    resume.isActive = false;
    await resume.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
