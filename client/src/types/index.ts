export type ExperienceLevel = 'Entry-Level / Junior' | 'Mid-Level (2-4 yrs)' | 'Senior (5+ yrs)' | 'Lead / Architect';

export type QuestionType = 'technical' | 'behavioral' | 'dsa' | 'system_design' | 'cs_fundamental';

export type CSCategory = 'DSA' | 'OOPs' | 'DBMS' | 'OS' | 'CN' | 'System Design';

export interface Question {
  id: string;
  type: QuestionType;
  category: CSCategory | string;
  questionText: string;
  contextOrCode?: string;
  expectedKeyPoints: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuestionEvaluation {
  questionId: string;
  userAnswer: string;
  score: number; // 0 - 100
  structureScore: number; // 0 - 100
  technicalScore: number; // 0 - 100
  clarityScore: number; // 0 - 100
  confidenceScore?: number; // 0 - 100 (webcam analysis metric)
  confidenceMetrics?: {
    eyeContact: number; // percentage
    stability: number; // facial movement stability percentage
    pacing: number; // speech speed words-per-minute
    emotion: string; // dominant emotion e.g. "Confident", "Focused", "Nervous"
  };
  keyPointsCovered: string[];
  keyPointsMissed: string[];
  feedback: string;
  positiveHighlights: string[];
  areasToImprove: string[];
  modelAnswer: string;
  inputMode?: 'spoken' | 'written';
  sentenceHighlights?: Array<{ text: string; status: 'strong' | 'weak' | 'neutral'; reason: string }>;
  hasAudio?: boolean;
  audioDurationSec?: number;
  audioEventMarkers?: Array<{
    timeSec: number;
    timestamp: string;
    label: string;
    text: string;
    type: 'filler' | 'pause' | 'pacing' | 'concept' | 'strength' | 'weakness';
  }>;
}

export interface ReplayCoachingMoment {
  timestamp: string; // MM:SS format
  timeSec?: number; // exact second in recording for audio seeking
  questionId?: string;
  questionIndex?: number;
  type: 'strength' | 'weakness' | 'coaching_tip';
  text: string;
  title: string;
  category?: string;
}

export interface InterviewSession {
  id: string;
  createdAt: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  difficultyMode?: 'Easy' | 'Medium' | 'Hard';
  roundType?: 'technical_screen' | 'dsa' | 'system_design' | 'behavioral';
  aiEngine?: 'gemini' | 'openai' | 'claude' | 'ollama';
  resumeText?: string;
  jobDescriptionText?: string;
  extractedSkills: string[];
  questions: Question[];
  evaluations: Record<string, QuestionEvaluation>;
  currentQuestionIndex: number;
  status: 'draft' | 'in_progress' | 'completed';
  totalScore?: number;
  overallConfidence?: number; // average confidence score across evaluations
  coachingTimeline?: ReplayCoachingMoment[]; // consolidated coaching points
  proctoringMode?: 'off' | 'standard' | 'strict';
  infractions?: number;
  proctoringFailed?: boolean;
  completedAt?: string;
  overallFeedback?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    actionableAdvice: string[];
  };
}

export interface PracticeQuestion {
  id: string;
  category: CSCategory;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  initialCodeSnippet?: string;
  hints: string[];
  sampleSolution: string;
  keyConcepts: string[];
}

export interface UserProgressStats {
  totalInterviewsCompleted: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  categoryScores: Record<CSCategory, number>;
  weakTopics: string[];
  strongTopics: string[];
  recentScores: { date: string; score: number; role: string }[];
}

export interface MCQPracticeQuestion {
  id: string;
  q: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, or 3
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  codeSnippet?: string;
  tag?: string;
}

export interface MCQAICoaching {
  deepDive: string;
  interviewTips: string[];
  commonTrap: string;
  realWorldAnalogy: string;
}

