const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  questionText: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  expectedKeyPoints: [{ type: String }],
  contextOrCode: { type: String },
});

const EvaluationSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  userAnswer: { type: String, required: true },
  score: { type: Number, required: true },
  structureScore: { type: Number },
  technicalScore: { type: Number },
  clarityScore: { type: Number },
  feedback: { type: String, required: true },
  keyPointsCovered: [{ type: String }],
  keyPointsMissed: [{ type: String }],
  positiveHighlights: [{ type: String }],
  areasToImprove: [{ type: String }],
  modelAnswer: { type: String },
});

const InterviewSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    difficultyMode: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    roundType: {
      type: String,
      enum: ['technical_screen', 'dsa', 'system_design', 'behavioral'],
      default: 'technical_screen',
    },
    resumeText: {
      type: String,
    },
    jobDescriptionText: {
      type: String,
    },
    extractedSkills: [{ type: String }],
    questions: [QuestionSchema],
    evaluations: {
      type: Map,
      of: EvaluationSchema,
      default: {},
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    totalScore: {
      type: Number,
    },
    completedAt: {
      type: Date,
    },
    overallFeedback: {
      summary: { type: String },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      actionableAdvice: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes for Performance ─────────────────────────────────
InterviewSessionSchema.index({ user: 1, createdAt: -1 });
InterviewSessionSchema.index({ sessionId: 1 });
InterviewSessionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.models.InterviewSession || mongoose.model('InterviewSession', InterviewSessionSchema);
