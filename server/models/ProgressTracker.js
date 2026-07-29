const mongoose = require('mongoose');

const ProgressTrackerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // format: YYYY-MM-DD
      required: true,
    },
    sessionsCompleted: {
      type: Number,
      default: 0,
    },
    questionsAnswered: {
      type: Number,
      default: 0,
    },
    topicsPracticed: [{ type: String }],
    averageScore: {
      type: Number,
      default: 0,
    },
    timeSpentMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound Index: One entry per user per day ──────────────
ProgressTrackerSchema.index({ user: 1, date: 1 }, { unique: true });
ProgressTrackerSchema.index({ user: 1, createdAt: -1 });

// ─── Static: Get or create today's entry ─────────────────────
ProgressTrackerSchema.statics.getOrCreateToday = async function (userId) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  let entry = await this.findOne({ user: userId, date: today });
  if (!entry) {
    entry = await this.create({ user: userId, date: today });
  }
  return entry;
};

// ─── Static: Calculate current streak ────────────────────────
ProgressTrackerSchema.statics.calculateStreak = async function (userId) {
  const entries = await this.find({ user: userId })
    .sort({ date: -1 })
    .limit(365)
    .select('date');

  if (entries.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < entries.length; i++) {
    const entryDate = new Date(entries[i].date);
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

module.exports = mongoose.models.ProgressTracker || mongoose.model('ProgressTracker', ProgressTrackerSchema);
