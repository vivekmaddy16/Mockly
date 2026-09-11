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
      aiEngine: s.aiEngine || 'gemini',
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
      overallConfidence: s.overallConfidence,
      coachingTimeline: s.coachingTimeline,
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
      aiEngine: s.aiEngine || 'gemini',
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
      overallConfidence: s.overallConfidence,
      coachingTimeline: s.coachingTimeline,
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
        aiEngine: session.aiEngine || 'gemini',
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

export const terminateSessionEarly = async (
  sessionId: string,
  infractions: number,
  proctoringFailed: boolean,
  overallFeedback: any
): Promise<InterviewSession | null> => {
  const session = getSessionById(sessionId);
  if (!session) return null;

  session.status = 'completed';
  session.infractions = infractions;
  session.proctoringFailed = proctoringFailed;
  session.overallFeedback = overallFeedback;
  session.completedAt = new Date().toISOString();

  // Calculate total score for evaluated answers
  const evals = Object.values(session.evaluations);
  if (evals.length > 0) {
    session.totalScore = Math.round(
      evals.reduce((acc, ev) => acc + (ev.score || 0), 0) / evals.length
    );
  } else {
    session.totalScore = 0;
  }

  saveLocalSession(session);

  if (isAuthenticated()) {
    try {
      await interviewApi.completeSession(
        sessionId,
        overallFeedback,
        infractions,
        proctoringFailed
      );
    } catch (err) {
      console.warn('Failed to sync early termination to API:', err);
    }
  }

  return session;
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

    // Compile dynamic interactive coaching timeline milestones from real audio & evaluation markers
    const timeline: NonNullable<typeof session.coachingTimeline> = [];

    session.questions.forEach((q, idx) => {
      const ev = session.evaluations[q.id];
      if (!ev) return;

      const duration = ev.audioDurationSec || 60;
      const formattedQTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      // 1. If real real-time audio markers were detected during the answer recording, prioritize them
      if (ev.audioEventMarkers && ev.audioEventMarkers.length > 0) {
        ev.audioEventMarkers.forEach(marker => {
          timeline.push({
            timestamp: marker.timestamp || formattedQTime(marker.timeSec),
            timeSec: marker.timeSec,
            questionId: q.id,
            questionIndex: idx,
            type: marker.type === 'filler' || marker.type === 'weakness' ? 'weakness' : marker.type === 'pacing' || marker.type === 'pause' ? 'coaching_tip' : 'strength',
            title: marker.label,
            text: marker.text,
            category: q.category,
          });
        });
      } else {
        // 2. Derive synchronized moments based on the question's content and actual answer duration
        if (ev.positiveHighlights && ev.positiveHighlights.length > 0) {
          const strengthSec = Math.min(15, Math.round(duration * 0.25));
          timeline.push({
            timestamp: formattedQTime(strengthSec),
            timeSec: strengthSec,
            questionId: q.id,
            questionIndex: idx,
            type: 'strength',
            title: `Strong Technical Point — Q${idx + 1}`,
            text: ev.positiveHighlights[0],
            category: q.category,
          });
        }

        const pacing = ev.confidenceMetrics?.pacing;
        if (typeof pacing === 'number' && pacing > 0 && (pacing < 110 || pacing > 155)) {
          const pacingSec = Math.round(duration * 0.5);
          timeline.push({
            timestamp: formattedQTime(pacingSec),
            timeSec: pacingSec,
            questionId: q.id,
            questionIndex: idx,
            type: 'coaching_tip',
            title: `Pacing Alert (${pacing} WPM) — Q${idx + 1}`,
            text: pacing < 110 
              ? `Delivery rate slowed to ${pacing} WPM. Maintain steady cadence to project confidence.`
              : `Delivery speed reached ${pacing} WPM. Pause deliberately to enhance articulation.`,
            category: q.category,
          });
        }

        if (ev.areasToImprove && ev.areasToImprove.length > 0) {
          const improveSec = Math.round(duration * 0.75);
          timeline.push({
            timestamp: formattedQTime(improveSec),
            timeSec: improveSec,
            questionId: q.id,
            questionIndex: idx,
            type: 'weakness',
            title: `Concept Expansion Area — Q${idx + 1}`,
            text: ev.areasToImprove[0],
            category: q.category,
          });
        }
      }
    });

    session.coachingTimeline = timeline.sort((a, b) => (a.timeSec ?? 0) - (b.timeSec ?? 0));

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
          session.proctoringFailed,
          session.overallConfidence,
          session.coachingTimeline
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
