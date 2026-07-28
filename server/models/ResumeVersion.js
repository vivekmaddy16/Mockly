const mongoose = require('mongoose');

const ResumeVersionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Default Resume',
    },
    resumeText: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
    },
    parsedSkills: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.ResumeVersion || mongoose.model('ResumeVersion', ResumeVersionSchema);
