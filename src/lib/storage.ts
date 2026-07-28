import { InterviewSession, UserProgressStats, QuestionEvaluation } from '@/types';

const API_KEY_STORAGE_KEY = 'mockly_gemini_api_key';
const SESSIONS_STORAGE_KEY = 'mockly_interview_sessions';
const PRACTICE_PROGRESS_KEY = 'mockly_practice_progress';

export const getStoredApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setStoredApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  if (!key || key.trim() === '') {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } else {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  }
};

export const getAllSessions = (): InterviewSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw || typeof raw !== 'string' || !raw.trim()) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const getSessionById = (id: string): InterviewSession | null => {
  const sessions = getAllSessions();
  return sessions.find(s => s.id === id) || null;
};

export const saveSession = (session: InterviewSession): void => {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    // Cap stored sessions to maximum 30 to prevent quota errors
    const trimmed = sessions.slice(0, 30);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('Failed to save session to localStorage (quota exceeded or restricted):', err);
  }
};

export const updateSessionEvaluation = (
  sessionId: string,
  questionId: string,
  evaluation: QuestionEvaluation
): InterviewSession | null => {
  const session = getSessionById(sessionId);
  if (!session) return null;

  session.evaluations[questionId] = evaluation;
  
  // Check if all questions have evaluations
  const totalQuestions = session.questions.length;
  const evaluatedCount = Object.keys(session.evaluations).length;

  if (evaluatedCount >= totalQuestions) {
    session.status = 'completed';
    const scores = Object.values(session.evaluations).map(e => e.score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));
    session.totalScore = avgScore;
    
    // Overall feedback calculation
    const allStrengths = Object.values(session.evaluations).flatMap(e => e.positiveHighlights);
    const allWeaknesses = Object.values(session.evaluations).flatMap(e => e.areasToImprove);
    
    session.overallFeedback = {
      summary: `You achieved an overall interview performance score of ${avgScore}%. ${
        avgScore >= 80 
          ? 'Excellent performance with strong technical depth and clear articulation.'
          : avgScore >= 60
          ? 'Solid foundational answers with good structure, but could expand on edge cases.'
          : 'Good effort! Focus on structured frameworks (like STAR) and deepening core technical concepts.'
      }`,
      strengths: Array.from(new Set(allStrengths)).slice(0, 4),
      weaknesses: Array.from(new Set(allWeaknesses)).slice(0, 4),
      actionableAdvice: [
        'Practice structuring your responses with the STAR method (Situation, Task, Action, Result) for behavioral questions.',
        'Always state Time and Space Complexity (Big-O) explicitly when explaining technical algorithms.',
        'Address trade-offs and edge cases proactively before the interviewer asks.'
      ]
    };
  }

  saveSession(session);
  return session;
};

export const getUserProgressStats = (): UserProgressStats => {
  const sessions = getAllSessions();
  const completed = sessions.filter(s => s.status === 'completed');
  
  let totalEvaluatedQuestions = 0;
  let totalScoreSum = 0;

  const categoryScores: Record<string, { sum: number; count: number }> = {
    DSA: { sum: 0, count: 0 },
    OOPs: { sum: 0, count: 0 },
    DBMS: { sum: 0, count: 0 },
    OS: { sum: 0, count: 0 },
    CN: { sum: 0, count: 0 },
    'System Design': { sum: 0, count: 0 }
  };

  completed.forEach(s => {
    Object.entries(s.evaluations).forEach(([qId, ev]) => {
      totalEvaluatedQuestions++;
      totalScoreSum += ev.score;

      const q = s.questions.find(item => item.id === qId);
      const category = (q?.category as string) || 'System Design';
      if (category in categoryScores) {
        categoryScores[category].sum += ev.score;
        categoryScores[category].count += 1;
      }
    });
  });

  const avgOverallScore = completed.length > 0
    ? Math.round(totalScoreSum / (totalEvaluatedQuestions || 1))
    : 0;

  const finalCategoryScores: Record<string, number> = {};
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];

  Object.entries(categoryScores).forEach(([cat, data]) => {
    const avg = data.count > 0 ? Math.round(data.sum / data.count) : 70; // baseline 70 if unassessed
    finalCategoryScores[cat] = avg;
    if (avg < 70) weakTopics.push(cat);
    if (avg >= 80) strongTopics.push(cat);
  });

  return {
    totalInterviewsCompleted: completed.length,
    totalQuestionsAnswered: totalEvaluatedQuestions,
    averageScore: avgOverallScore,
    categoryScores: finalCategoryScores as any,
    weakTopics: weakTopics.length ? weakTopics : ['System Design', 'OS'],
    strongTopics: strongTopics.length ? strongTopics : ['DSA', 'React'],
    recentScores: completed.slice(0, 5).map(s => ({
      date: new Date(s.createdAt).toLocaleDateString(),
      score: s.totalScore || 0,
      role: s.targetRole
    }))
  };
};
