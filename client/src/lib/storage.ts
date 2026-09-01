import { InterviewSession, UserProgressStats, QuestionEvaluation } from '@/types';
import { interviewApi, progressApi, getAuthToken } from '@/lib/apiClient';

const SESSIONS_STORAGE_KEY = 'mockly_interview_sessions';
const PRACTICE_PROGRESS_KEY = 'mockly_practice_progress';

// ═══════════════════════════════════════════════════════════════
// Helper: Check if user is authenticated
// ═══════════════════════════════════════════════════════════════
const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ═══════════════════════════════════════════════════════════════
// Session Storage — API-first with localStorage fallback
// ═══════════════════════════════════════════════════════════════

// ─── localStorage helpers (fallback for unauthenticated users) ─
const getLocalSessions = (): InterviewSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw || typeof raw !== 'string' || !raw.trim()) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveLocalSession = (session: InterviewSession): void => {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getLocalSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    const trimmed = sessions.slice(0, 30);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('Failed to save session to localStorage:', err);
  }
};

// ─── API-first Session Functions ─────────────────────────────

export const getAllSessions = (): InterviewSession[] => {
  // Synchronous fallback — for immediate UI rendering
  // Use fetchAllSessionsAsync for API data
  return getLocalSessions();
};

export const fetchAllSessionsAsync = async (): Promise<InterviewSession[]> => {
  if (!isAuthenticated()) {
    return getLocalSessions();
  }

  try {
    const data = await interviewApi.getSessions(1, 50);
    // Map backend format to frontend format
    return data.sessions.map((s: any) => ({
      id: s.sessionId,
      createdAt: s.createdAt,
      targetRole: s.targetRole,
      experienceLevel: s.experienceLevel,
      difficultyMode: s.difficultyMode || 'Medium',
      roundType: s.roundType || 'technical_screen',
      resumeText: s.resumeText,
      jobDescriptionText: s.jobDescriptionText,
      extractedSkills: s.extractedSkills || [],
      questions: s.questions || [],
      evaluations: s.evaluations instanceof Map
        ? Object.fromEntries(s.evaluations)
        : (s.evaluations || {}),
      currentQuestionIndex: s.currentQuestionIndex || 0,
      status: s.status || 'in_progress',
      totalScore: s.totalScore,
      overallFeedback: s.overallFeedback,
      proctoringMode: s.proctoringMode || 'standard',
      infractions: s.infractions || 0,
      proctoringFailed: s.proctoringFailed || false,
    }));
  } catch (err) {
    console.warn('Failed to fetch sessions from API, using localStorage:', err);
    return getLocalSessions();
  }
};

export const getSessionById = (id: string): InterviewSession | null => {
  const sessions = getLocalSessions();
  return sessions.find(s => s.id === id) || null;
};

export const fetchSessionByIdAsync = async (id: string): Promise<InterviewSession | null> => {
  if (!isAuthenticated()) {
    return getSessionById(id);
  }

  try {
    const s = await interviewApi.getSessionById(id);
    return {
      id: s.sessionId,
      createdAt: s.createdAt,
      targetRole: s.targetRole,
      experienceLevel: s.experienceLevel,
      difficultyMode: s.difficultyMode || 'Medium',
      roundType: s.roundType || 'technical_screen',
      resumeText: s.resumeText,
      jobDescriptionText: s.jobDescriptionText,
      extractedSkills: s.extractedSkills || [],
      questions: s.questions || [],
      evaluations: s.evaluations instanceof Map
        ? Object.fromEntries(s.evaluations)
        : (s.evaluations || {}),
      currentQuestionIndex: s.currentQuestionIndex || 0,
      status: s.status || 'in_progress',
      totalScore: s.totalScore,
      overallFeedback: s.overallFeedback,
      proctoringMode: s.proctoringMode || 'standard',
      infractions: s.infractions || 0,
      proctoringFailed: s.proctoringFailed || false,
    };
  } catch {
    return getSessionById(id);
  }
};

export const saveSession = async (session: InterviewSession): Promise<void> => {
  // Always save to localStorage as immediate cache
  saveLocalSession(session);

  // If authenticated, also save to backend
  if (isAuthenticated()) {
    try {
      await interviewApi.createSession({
        sessionId: session.id,
        targetRole: session.targetRole,
        experienceLevel: session.experienceLevel,
        difficultyMode: session.difficultyMode || 'Medium',
        roundType: session.roundType || 'technical_screen',
        resumeText: session.resumeText,
        jobDescriptionText: session.jobDescriptionText,
        extractedSkills: session.extractedSkills,
        questions: session.questions,
        proctoringMode: session.proctoringMode || 'standard',
      });
    } catch (err) {
      console.warn('Failed to save session to API:', err);
    }
  }
};

export const updateSessionEvaluation = async (
  sessionId: string,
  questionId: string,
  evaluation: QuestionEvaluation
): Promise<InterviewSession | null> => {
  // Update localStorage
  const session = getSessionById(sessionId);
  if (!session) return null;

  session.evaluations[questionId] = evaluation;

  const totalQuestions = session.questions.length;
  const evaluatedCount = Object.keys(session.evaluations).length;

  if (evaluatedCount >= totalQuestions) {
    session.status = 'completed';
    const scores = Object.values(session.evaluations).map(e => e.score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));
    session.totalScore = avgScore;

    // Calculate average confidence score
    const confidences = Object.values(session.evaluations)
      .map(e => e.confidenceScore)
      .filter((c): c is number => typeof c === 'number');
    session.overallConfidence = confidences.length > 0 
      ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
      : undefined;

    // Compile dynamic interactive coaching timeline milestones
    const timeline: typeof session.coachingTimeline = [];
    let cumulativeSeconds = 0;

    Object.values(session.evaluations).forEach((ev, idx) => {
      const formattedQTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      // Add a strength moment
      if (ev.positiveHighlights && ev.positiveHighlights.length > 0) {
        timeline.push({
          timestamp: formattedQTime(cumulativeSeconds + 12),
          type: 'strength',
          title: `Strong Delivery - Q${idx + 1}`,
          text: ev.positiveHighlights[0]
        });
      }

      // Add pacing / confidence moment
      const pacing = ev.confidenceMetrics?.pacing;
      const eyeContact = ev.confidenceMetrics?.eyeContact;
      if (typeof pacing === 'number' && pacing > 0 && pacing < 110) {
        timeline.push({
          timestamp: formattedQTime(cumulativeSeconds + 32),
          type: 'coaching_tip',
          title: `Pacing Alert - Q${idx + 1}`,
          text: `Your pacing slowed to ${pacing} WPM. Try keeping a steady tempo to project clarity.`
        });
      } else if (typeof pacing === 'number' && pacing > 150) {
        timeline.push({
          timestamp: formattedQTime(cumulativeSeconds + 28),
          type: 'coaching_tip',
          title: `Pacing Alert - Q${idx + 1}`,
          text: `Speech rate elevated to ${pacing} WPM. Pause slightly between bullet points to aid listener comprehension.`
        });
      } else if (typeof eyeContact === 'number' && eyeContact > 0 && eyeContact < 88) {
        timeline.push({
          timestamp: formattedQTime(cumulativeSeconds + 24),
          type: 'weakness',
          title: `Focus Interruption - Q${idx + 1}`,
          text: `Gaze detection dropped below ${eyeContact}%. Remember to look directly at the webcam as if making eye contact with the board.`
        });
      }

      // Add improvement moment
      if (ev.areasToImprove && ev.areasToImprove.length > 0) {
        timeline.push({
          timestamp: formattedQTime(cumulativeSeconds + 48),
          type: 'weakness',
          title: `Knowledge Gap - Q${idx + 1}`,
          text: ev.areasToImprove[0]
        });
      }

      cumulativeSeconds += 75; // assume ~75s per answer interval
    });

    session.coachingTimeline = timeline.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    const allStrengths = Object.values(session.evaluations).flatMap(e => e.positiveHighlights);
    const allWeaknesses = Object.values(session.evaluations).flatMap(e => e.areasToImprove);

    session.overallFeedback = {
      summary: `You achieved an overall interview performance score of ${avgScore}% with a facial communication confidence rating of ${session.overallConfidence}%. ${
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

  saveLocalSession(session);

  // Sync to backend
  if (isAuthenticated()) {
    try {
      await interviewApi.updateEvaluation(
        sessionId,
        questionId,
        evaluation,
        session.infractions,
        session.proctoringFailed
      );

      if (session.status === 'completed') {
        await interviewApi.completeSession(
          sessionId,
          session.overallFeedback,
          session.infractions,
          session.proctoringFailed
        );
      }
    } catch (err) {
      console.warn('Failed to sync evaluation to API:', err);
    }
  }

  return session;
};

// ═══════════════════════════════════════════════════════════════
// Progress Stats — API-first with localStorage fallback
// ═══════════════════════════════════════════════════════════════

export const getUserProgressStats = (): UserProgressStats => {
  // Synchronous fallback from localStorage
  const sessions = getLocalSessions();
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
    const avg = data.count > 0 ? Math.round(data.sum / data.count) : 70;
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

export const fetchUserProgressStatsAsync = async (): Promise<UserProgressStats> => {
  if (!isAuthenticated()) {
    return getUserProgressStats();
  }

  try {
    const stats = await progressApi.getStats();
    return {
      totalInterviewsCompleted: stats.totalInterviews || 0,
      totalQuestionsAnswered: stats.totalQuestionsAnswered || 0,
      averageScore: stats.avgScore || 0,
      categoryScores: stats.categoryScores || {},
      weakTopics: stats.weakTopics || [],
      strongTopics: stats.strongTopics || [],
      recentScores: stats.recentScores || [],
    };
  } catch {
    return getUserProgressStats();
  }
};

// ═══════════════════════════════════════════════════════════════
// Migration: Upload localStorage data to MongoDB on first login
// ═══════════════════════════════════════════════════════════════
export const migrateLocalDataToBackend = async (): Promise<void> => {
  if (!isAuthenticated()) return;

  const migrated = localStorage.getItem('mockly_data_migrated');
  if (migrated) return;

  const localSessions = getLocalSessions();
  if (localSessions.length === 0) {
    localStorage.setItem('mockly_data_migrated', 'true');
    return;
  }

  console.log(`📦 Migrating ${localSessions.length} sessions from localStorage to MongoDB...`);

  let migratedCount = 0;
  for (const session of localSessions) {
    try {
      await interviewApi.createSession({
        sessionId: session.id,
        targetRole: session.targetRole,
        experienceLevel: session.experienceLevel,
        difficultyMode: session.difficultyMode || 'Medium',
        roundType: session.roundType || 'technical_screen',
        resumeText: session.resumeText,
        jobDescriptionText: session.jobDescriptionText,
        extractedSkills: session.extractedSkills,
        questions: session.questions,
      });
      migratedCount++;
    } catch {
      // Session might already exist — skip
    }
  }

  console.log(`✅ Migrated ${migratedCount}/${localSessions.length} sessions`);
  localStorage.setItem('mockly_data_migrated', 'true');
};
