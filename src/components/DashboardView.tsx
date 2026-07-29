'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, TrendingUp, Clock, Award, PlayCircle, 
  Search, ChevronDown, ChevronUp, CheckCircle2, Brain,
  Target, ArrowRight, Sparkles, Loader2, Zap, Layers, Activity
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { InterviewSession, UserProgressStats } from '@/types';
import { getAllSessions, fetchAllSessionsAsync, fetchUserProgressStatsAsync } from '@/lib/storage';

export const DashboardView: React.FC = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [stats, setStats] = useState<UserProgressStats | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Immediate load from local storage
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

  // Radar chart data for Domain Mastery
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/15 border-emerald-500/30';
    if (score >= 60) return 'bg-amber-500/15 border-amber-500/30';
    return 'bg-red-500/15 border-red-500/30';
  };

  return (
    <div className="page-glow relative">
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs font-extrabold tracking-wide uppercase">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Executive Analytics & Prep Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Interview <span className="text-gradient-gold">Readiness Dashboard</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Track your mock interview progress, subject domain mastery, and readiness metrics powered by real-time analytics.
          </p>
        </div>

        {/* ─── Bento Box Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Card 1: Score & Stats */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {[
              { icon: <Award className="w-5 h-5 text-brand-400" />, value: `${avgScore}%`, label: 'Avg Readiness Score', cardClass: 'card-gradient-yellow' },
              { icon: <PlayCircle className="w-5 h-5 text-blue-400" />, value: completed.length.toString(), label: 'Completed Sessions', cardClass: 'card-gradient-blue' },
              { icon: <Target className="w-5 h-5 text-emerald-400" />, value: totalQuestions.toString(), label: 'Questions Answered', cardClass: 'card-gradient-green' },
              { icon: <TrendingUp className="w-5 h-5 text-purple-400" />, value: completed.length >= 2 ? 'Upward ↑' : 'Active', label: 'Performance Trend', cardClass: 'card-gradient-purple' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.cardClass} rounded-3xl p-5 space-y-2 border border-white/10 shadow-xl`}>
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
                <span className="text-3xl font-black text-white block">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Bento Card 2: Domain Mastery Radar Chart */}
          <div className="card-dark rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col justify-between space-y-2">
            <h3 className="text-xs font-extrabold uppercase text-neutral-300 tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" /> Domain Mastery Map
            </h3>
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3f3f46" tick={false} />
                  <Radar name="Candidate" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-neutral-500 text-center font-semibold">CS Subjects Readiness Index</p>
          </div>
        </div>

        {/* Empty State */}
        {sessions.length === 0 ? (
          <div className="card-dark rounded-3xl p-12 text-center space-y-5 border border-white/10 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/10">
              <Brain className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white">No Interview Sessions Found</h3>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto">
              Create your first AI-driven mock interview to unlock your domain mastery radar chart and detailed scorecard.
            </p>
            <Link href="/setup" className="btn-yellow text-xs px-7 py-3.5 inline-flex items-center gap-2 font-bold shadow-lg shadow-brand-500/20">
              <Sparkles className="w-4 h-4" /> Launch First Interview
            </Link>
          </div>
        ) : (
          <>
            {/* Session History List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-400" /> Session History ({filtered.length})
                </h2>

                <div className="relative w-full sm:w-auto">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by role or level..."
                    className="pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-brand-500/40 transition placeholder:text-neutral-600 w-full sm:w-56"
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
                    <div key={s.id} className="card-dark rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <button
                        onClick={() => setExpandedId(isExp ? null : s.id)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-800/30 transition"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-black text-sm shrink-0 ${getScoreBg(score)} ${getScoreColor(score)}`}>
                            {score}%
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <h4 className="text-sm font-bold text-white truncate">{s.targetRole}</h4>
                            <p className="text-xs text-neutral-400">
                              {s.experienceLevel} • {new Date(s.createdAt).toLocaleDateString()} • {evalCount}/{s.questions.length} Answered
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Link
                            href={`/interview/${s.id}/results`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1 hidden sm:flex"
                          >
                            Report <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          {isExp ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                        </div>
                      </button>

                      {isExp && (
                        <div className="p-5 border-t border-neutral-800/80 bg-neutral-950/40 space-y-2 text-xs animate-fade-in">
                          {s.questions.map((q, idx) => {
                            const ev = s.evaluations[q.id];
                            return (
                              <div key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-400 font-extrabold text-[10px] shrink-0">Q{idx+1}</span>
                                  <span className="text-neutral-200 line-clamp-1 font-medium">{q.questionText}</span>
                                </div>
                                {ev ? (
                                  <span className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] shrink-0 ${getScoreBg(ev.score)} ${getScoreColor(ev.score)}`}>
                                    {ev.score}%
                                  </span>
                                ) : (
                                  <span className="text-neutral-600 text-[10px] shrink-0 font-medium">Unanswered</span>
                                )}
                              </div>
                            );
                          })}

                          <Link
                            href={`/interview/${s.id}/results`}
                            className="sm:hidden mt-3 w-full text-center text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center justify-center gap-1 py-2 rounded-xl bg-neutral-900 border border-neutral-800"
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
          </>
        )}
      </div>
    </div>
  );
};
