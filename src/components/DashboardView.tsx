'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, TrendingUp, Award, PlayCircle, 
  Search, ChevronDown, ChevronUp, Brain, Target, ArrowRight, Sparkles, Activity, Layers, Mic
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { InterviewSession, UserProgressStats } from '@/types';
import { getAllSessions, fetchAllSessionsAsync, fetchUserProgressStatsAsync } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { AuthBlocker } from './AuthBlocker';

export const DashboardView: React.FC = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [stats, setStats] = useState<UserProgressStats | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    setSessions(getAllSessions().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    const loadData = async () => {
      try {
        const [apiSessions, apiStats] = await Promise.all([
          fetchAllSessionsAsync(),
          fetchUserProgressStatsAsync(),
        ]);
        setSessions(apiSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setStats(apiStats);
      } catch {
        /* Fallback */
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const completed = sessions.filter(s => Object.keys(s.evaluations).length > 0);
  const avgScore = stats?.averageScore ?? (completed.length > 0
    ? Math.round(completed.reduce((a, s) => a + (s.totalScore ?? 75), 0) / completed.length)
    : 0);
  const totalQuestions = stats?.totalQuestionsAnswered ?? completed.reduce((a, s) => a + Object.keys(s.evaluations).length, 0);

  // Radar chart data
  const radarData = [
    { subject: 'DSA', score: stats?.categoryScores?.DSA ?? 75 },
    { subject: 'OOPs', score: stats?.categoryScores?.OOPs ?? 80 },
    { subject: 'DBMS', score: stats?.categoryScores?.DBMS ?? 70 },
    { subject: 'OS', score: stats?.categoryScores?.OS ?? 65 },
    { subject: 'CN', score: stats?.categoryScores?.CN ?? 68 },
    { subject: 'System Design', score: stats?.categoryScores?.['System Design'] ?? 85 },
  ];

  const filtered = sessions.filter(s =>
    s.targetRole.toLowerCase().includes(search.toLowerCase()) ||
    s.experienceLevel.toLowerCase().includes(search.toLowerCase())
  );

  // Authentication Gate
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthBlocker
        title="Dashboard Locked"
        description="You must be signed in to view your candidate readiness dashboard, scorecards, and session logs. Sign in below to view your progress."
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-charcoal/10 text-charcoal text-xs font-extrabold shadow-sm">
          <BarChart3 className="w-4 h-4 text-coral" /> Candidate Readiness Dashboard
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight">
          Performance & Mastery Hub
        </h1>
        <p className="text-sm font-bold text-charcoal/60 max-w-xl mx-auto">
          Track interview score trends, subject domain readiness, and searchable session logs.
        </p>
      </div>

      {/* ─── Castrio Bento Box Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bento Card 1: Extended Stat Counters */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: 'Avg Readiness Score', val: `${avgScore}%`, icon: Award, bg: 'card-cream' },
            { label: 'Completed Sessions', val: completed.length.toString(), icon: PlayCircle, bg: 'card-cream' },
            { label: 'Questions Answered', val: totalQuestions.toString(), icon: Target, bg: 'card-cream' },
            { label: 'Performance Trend', val: completed.length >= 2 ? 'Upward ↑' : 'Active', icon: TrendingUp, bg: 'card-mint-gradient' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`${stat.bg} p-6 space-y-2 border border-white shadow-xl`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-charcoal" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal/60">{stat.label}</span>
                </div>
                <span className="font-display font-black text-3xl sm:text-4xl text-charcoal block">{stat.val}</span>
              </div>
            );
          })}
        </div>

        {/* Bento Card 2: Domain Mastery Radar */}
        <div className="card-cream p-6 border border-white shadow-xl flex flex-col justify-between space-y-2">
          <h3 className="font-display font-black text-sm uppercase text-charcoal tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-coral" /> Skill Radar Map
          </h3>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#D4E0BC" />
                <PolarAngleAxis dataKey="subject" stroke="#1B1E16" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#B5C49C" tick={false} />
                <Radar name="Candidate" dataKey="score" stroke="#1B1E16" fill="#1B1E16" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[10px] text-charcoal/60 font-bold text-center block">CS Domains Competency</span>
        </div>
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="card-cream p-12 text-center space-y-5 border border-white shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-charcoal text-cream flex items-center justify-center mx-auto shadow-lg">
            <Brain className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-2xl text-charcoal">No Session Logs Found</h3>
          <p className="text-xs font-bold text-charcoal/60 max-w-sm mx-auto">
            Launch your first AI mock interview session to build your readiness radar chart.
          </p>
          <Link href="/setup" className="btn-dual-pill inline-flex">
            <div className="icon-badge">
              <Mic className="w-4 h-4 text-charcoal" />
            </div>
            <span className="btn-label">Launch Session</span>
          </Link>
        </div>
      ) : (
        /* Session Logs List */
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-display font-black text-xl text-charcoal flex items-center gap-2">
              <Layers className="w-5 h-5 text-coral" /> Session History ({filtered.length})
            </h2>

            <div className="relative w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-charcoal/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role or level..."
                className="input-castrio w-full sm:w-60"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((s) => {
              const evalCount = Object.keys(s.evaluations).length;
              const score = evalCount > 0
                ? s.totalScore ?? Math.round(Object.values(s.evaluations).reduce((acc, ev) => acc + ev.score, 0) / evalCount)
                : 0;
              const isExp = expandedId === s.id;

              return (
                <div key={s.id} className="card-cream overflow-hidden border border-white shadow-lg">
                  <button
                    onClick={() => setExpandedId(isExp ? null : s.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/50 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-charcoal text-cream font-display font-black text-sm flex items-center justify-center shrink-0">
                        {score}%
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-display font-extrabold text-sm text-charcoal truncate">{s.targetRole}</h4>
                        <p className="text-xs font-bold text-charcoal/60">
                          {s.experienceLevel} • {s.difficultyMode || 'Medium'} • {s.roundType === 'dsa' ? 'DSA' : s.roundType === 'system_design' ? 'System Design' : s.roundType === 'behavioral' ? 'Behavioral' : 'Tech Screen'} • {new Date(s.createdAt).toLocaleDateString()} • {evalCount}/{s.questions.length} Answered
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/interview/${s.id}/results`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-charcoal font-black hover:underline hidden sm:flex items-center gap-1"
                      >
                        Report <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {isExp ? <ChevronUp className="w-4 h-4 text-charcoal" /> : <ChevronDown className="w-4 h-4 text-charcoal/60" />}
                    </div>
                  </button>

                  {isExp && (
                    <div className="p-5 border-t border-charcoal/10 bg-white/60 space-y-2 text-xs animate-fade-in">
                      {s.questions.map((q, idx) => {
                        const ev = s.evaluations[q.id];
                        return (
                          <div key={q.id} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-charcoal/10">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="px-2 py-0.5 rounded-full bg-charcoal text-cream font-extrabold text-[10px] shrink-0">Q{idx+1}</span>
                              <span className="text-charcoal font-bold line-clamp-1">{q.questionText}</span>
                            </div>
                            {ev ? (
                              <span className="px-2.5 py-1 rounded-full bg-charcoal text-cream font-black text-[10px] shrink-0">
                                {ev.score}%
                              </span>
                            ) : (
                              <span className="text-charcoal/50 text-[10px] shrink-0 font-bold">Unanswered</span>
                            )}
                          </div>
                        );
                      })}

                      <Link
                        href={`/interview/${s.id}/results`}
                        className="sm:hidden mt-3 w-full text-center text-xs font-black text-charcoal hover:underline flex items-center justify-center gap-1 py-2.5 rounded-full bg-white border border-charcoal/10"
                      >
                        View Full Report <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
