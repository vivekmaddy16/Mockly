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
  keyPointsCovered: string[];
  keyPointsMissed: string[];
  feedback: string;
  positiveHighlights: string[];
  areasToImprove: string[];
  modelAnswer: string;
}

export interface InterviewSession {
  id: string;
  createdAt: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  resumeText?: string;
  jobDescriptionText?: string;
  extractedSkills: string[];
  questions: Question[];
  evaluations: Record<string, QuestionEvaluation>;
  currentQuestionIndex: number;
  status: 'draft' | 'in_progress' | 'completed';
  totalScore?: number;
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
