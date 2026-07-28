'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, TrendingUp, Clock, Award, PlayCircle, 
  Search, ChevronDown, ChevronUp, CheckCircle2, Brain,
  Target, ArrowRight, Sparkles
} from 'lucide-react';
import { InterviewSession } from '@/types';
import { getAllSessions } from '@/lib/storage';

export const DashboardView: React.FC = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setSessions(getAllSessions().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const completed = sessions.filter(s => Object.keys(s.evaluations).length > 0);
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((a, s) => a + (s.totalScore ?? Math.round(Object.values(s.evaluations).reduce((acc, ev) => acc + ev.score, 0) / (Object.keys(s.evaluations).length || 1))), 0) / completed.length)
    : 0;
  const totalQuestions = completed.reduce((a, s) => a + Object.keys(s.evaluations).length, 0);

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
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  // Limit chart bars for mobile readability
  const chartData = completed.slice(-10);
  const mobileChartData = chartData.slice(-5);

  return (
    <div className="page-glow relative">
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-300 text-xs font-semibold">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Performance Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your <span className="text-gradient-gold">Interview Dashboard</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Track your mock interview performance, identify weak areas, and monitor your readiness over time.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Award className="w-5 h-5 text-brand-400" />, value: `${avgScore}%`, label: 'Avg Readiness Score', cardClass: 'card-gradient-yellow' },
            { icon: <PlayCircle className="w-5 h-5 text-blue-400" />, value: completed.length.toString(), label: 'Completed Sessions', cardClass: 'card-gradient-blue' },
            { icon: <Target className="w-5 h-5 text-emerald-400" />, value: totalQuestions.toString(), label: 'Questions Answered', cardClass: 'card-gradient-green' },
            { icon: <TrendingUp className="w-5 h-5 text-purple-400" />, value: completed.length >= 2 ? 'Trending ↑' : 'N/A', label: 'Score Trend', cardClass: 'card-gradient-purple' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.cardClass} rounded-2xl p-5 space-y-3`}>
              <div className="flex items-center gap-2">
                {stat.icon}
                <span className="text-xs text-neutral-500 font-medium">{stat.label}</span>
              </div>
              <span className="text-2xl font-extrabold text-white">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sessions.length === 0 ? (
          <div className="card-dark rounded-3xl p-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto">
              <Brain className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white">No Sessions Yet</h3>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto">
              Start your first AI-powered mock interview to see your performance analytics and progress here.
            </p>
            <Link href="/setup" className="btn-yellow text-xs px-6 py-3 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Create First Interview
            </Link>
          </div>
        ) : (
          <>
            {/* Score Chart */}
            {completed.length >= 2 && (
              <div className="card-dark rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Score Trend
                </h3>
                {/* Desktop chart */}
                <div className="hidden sm:flex items-end gap-2 h-32">
                  {chartData.map((s, idx) => {
                    const score = s.totalScore ?? Math.round(Object.values(s.evaluations).reduce((acc, ev) => acc + ev.score, 0) / (Object.keys(s.evaluations).length || 1));
                    return (
                      <div key={s.id || idx} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-bold ${getScoreColor(score)}`}>{score}%</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-brand-500/30 to-brand-500/60 transition-all duration-700 ease-out"
                          style={{ height: `${Math.max(score * 0.9, 8)}%` }}
                        />
                        <span className="text-[9px] text-neutral-600 truncate max-w-full">
                          {new Date(s.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Mobile chart — limited bars */}
                <div className="sm:hidden flex items-end gap-3 h-28">
                  {mobileChartData.map((s, idx) => {
                    const score = s.totalScore ?? Math.round(Object.values(s.evaluations).reduce((acc, ev) => acc + ev.score, 0) / (Object.keys(s.evaluations).length || 1));
                    return (
                      <div key={s.id || idx} className="flex-1 flex flex-col items-center gap-1 min-w-[40px]">
                        <span className={`text-[10px] font-bold ${getScoreColor(score)}`}>{score}%</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-brand-500/30 to-brand-500/60 transition-all duration-700 ease-out"
                          style={{ height: `${Math.max(score * 0.9, 8)}%` }}
                        />
                        <span className="text-[9px] text-neutral-600 truncate max-w-full">
                          {new Date(s.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Session History */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-white">Session History</h2>
                <div className="relative w-full sm:w-auto">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search sessions..."
                    className="pl-8 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-brand-500/40 transition placeholder:text-neutral-600 w-full sm:w-48"
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
                    <div key={s.id} className="card-dark rounded-2xl overflow-hidden">
                      <button onClick={() => setExpandedId(isExp ? null : s.id)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-800/20 transition">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-extrabold text-sm shrink-0 ${getScoreBg(score)} ${getScoreColor(score)}`}>
                            {score}%
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{s.targetRole}</h4>
                            <p className="text-xs text-neutral-500">{s.experienceLevel} • {new Date(s.createdAt).toLocaleDateString()} • {evalCount}/{s.questions.length} answered</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Link href={`/interview/${s.id}/results`} onClick={(e) => e.stopPropagation()}
                            className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 hidden sm:flex">
                            View <ArrowRight className="w-3 h-3" />
                          </Link>
                          {isExp ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                        </div>
                      </button>

                      {isExp && (
                        <div className="p-5 border-t border-neutral-800/80 bg-neutral-900/30 space-y-2 text-xs animate-fade-in">
                          {s.questions.map((q, idx) => {
                            const ev = s.evaluations[q.id];
                            return (
                              <div key={q.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e0e0e] border border-neutral-800">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="px-2 py-0.5 rounded-lg bg-neutral-900 text-neutral-500 font-bold text-[10px] shrink-0">Q{idx+1}</span>
                                  <span className="text-neutral-300 line-clamp-1">{q.questionText}</span>
                                </div>
                                {ev ? (
                                  <span className={`px-2.5 py-0.5 rounded-lg border font-bold text-[10px] shrink-0 ${getScoreBg(ev.score)} ${getScoreColor(ev.score)}`}>{ev.score}%</span>
                                ) : (
                                  <span className="text-neutral-600 text-[10px] shrink-0">Unanswered</span>
                                )}
                              </div>
                            );
                          })}
                          {/* Mobile view link */}
                          <Link href={`/interview/${s.id}/results`}
                            className="sm:hidden mt-2 w-full text-center text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center justify-center gap-1 py-2">
                            View Full Report <ArrowRight className="w-3 h-3" />
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
