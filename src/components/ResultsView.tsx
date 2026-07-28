'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Trophy, Target, CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw, 
  BookOpen, ChevronDown, ChevronUp, Award, Brain, BarChart2
} from 'lucide-react';
import { InterviewSession } from '@/types';
import confetti from 'canvas-confetti';

interface ResultsViewProps {
  session: InterviewSession;
}

// Animated SVG circular progress ring
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' };
    if (s >= 60) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' };
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' };
  };

  const color = getColor(score);

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        {/* Background ring */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="8" />
        {/* Animated progress ring */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 8px ${color.glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white">{animatedScore}%</span>
        <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Readiness</span>
      </div>
    </div>
  );
};

export const ResultsView: React.FC<ResultsViewProps> = ({ session }) => {
  const [expandedQId, setExpandedQId] = useState<string | null>(session.questions[0]?.id || null);
  const confettiFired = useRef(false);

  const totalScore = session.totalScore ?? Math.round(
    Object.values(session.evaluations).reduce((acc, ev) => acc + ev.score, 0) /
    (Object.keys(session.evaluations).length || 1)
  );

  // Fire confetti for high scores
  useEffect(() => {
    if (totalScore >= 80 && !confettiFired.current && Object.keys(session.evaluations).length > 0) {
      confettiFired.current = true;
      const duration = 2500;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#E8A200', '#f5b731', '#10b981', '#3b82f6', '#8b5cf6'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#E8A200', '#f5b731', '#10b981', '#3b82f6', '#8b5cf6'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [totalScore, session.evaluations]);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-red-400 border-red-500/20 bg-red-500/10';
  };

  return (
    <div className="page-glow relative">
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Card */}
        <div className="card-dark rounded-3xl p-8 border border-brand-500/15 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-300 text-xs font-bold">
            <Trophy className="w-4 h-4 text-brand-400" /> Interview Performance Report
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{session.targetRole}</h1>
            <p className="text-xs text-neutral-500">{session.experienceLevel} • {new Date(session.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Animated Score Circle */}
          <div className="flex justify-center">
            <ScoreRing score={totalScore} />
          </div>

          {/* High Score Badge */}
          {totalScore >= 80 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-fade-in">
              <Award className="w-4 h-4" /> Outstanding Performance! 🎉
            </div>
          )}

          {session.overallFeedback && (
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
              {session.overallFeedback.summary}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/setup" className="btn-yellow text-xs px-5 py-2.5 inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> New Interview
            </Link>
            <Link href="/practice" className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white transition inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" /> Practice Topics
            </Link>
            <Link href="/dashboard" className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white transition inline-flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" /> Dashboard
            </Link>
          </div>
        </div>

        {/* Strengths & Advice */}
        {session.overallFeedback && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="card-dark rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strengths</h3>
              <ul className="space-y-2 text-neutral-400">
                {(session.overallFeedback.strengths ?? []).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-dark rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-brand-400" /> Actionable Improvements</h3>
              <ul className="space-y-2 text-neutral-400">
                {(session.overallFeedback.actionableAdvice ?? []).map((a, i) => (
                  <li key={i} className="flex items-start gap-2 bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Per-Question Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-400" /> Question-by-Question Breakdown
          </h2>
          <div className="space-y-3">
            {session.questions.map((q, idx) => {
              const ev = session.evaluations[q.id];
              const isExp = expandedQId === q.id;
              return (
                <div key={q.id} className="card-dark rounded-2xl overflow-hidden">
                  <button onClick={() => setExpandedQId(isExp ? null : q.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-800/20 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-400 font-bold text-xs shrink-0">Q{idx+1}</span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white line-clamp-1">{q.questionText}</h4>
                        <p className="text-xs text-neutral-500">{q.category} • {q.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {ev ? <span className={`px-3 py-1 rounded-xl border font-bold text-xs ${getScoreBadgeColor(ev.score)}`}>{ev.score}%</span>
                        : <span className="px-3 py-1 rounded-xl bg-neutral-900 text-neutral-500 text-xs font-semibold">Skipped</span>}
                      {isExp ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                    </div>
                  </button>
                  {isExp && ev && (
                    <div className="p-5 border-t border-neutral-800/80 bg-neutral-900/30 space-y-5 text-xs animate-fade-in">
                      <div>
                        <span className="block font-bold text-neutral-500 uppercase tracking-wider text-[10px] mb-1">Your Response</span>
                        <div className="p-3.5 rounded-xl bg-[#0e0e0e] border border-neutral-800 text-neutral-300 font-mono whitespace-pre-wrap">{ev.userAnswer}</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15 text-blue-200">
                        <span className="font-bold text-blue-400 block mb-1">Feedback</span>{ev.feedback}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                          <span className="font-bold text-emerald-400 block mb-1.5">Covered</span>
                          <ul className="space-y-1 text-neutral-400">
                            {ev.keyPointsCovered.map((p, i) => <li key={i} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />{p}</li>)}
                          </ul>
                        </div>
                        <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15">
                          <span className="font-bold text-red-400 block mb-1.5">Missed</span>
                          <ul className="space-y-1 text-neutral-400">
                            {ev.keyPointsMissed.map((p, i) => <li key={i} className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />{p}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <span className="block font-bold text-brand-400 uppercase tracking-wider text-[10px] mb-1">Model Answer</span>
                        <div className="p-3.5 rounded-xl bg-[#0e0e0e] border border-neutral-800 text-neutral-400 font-mono whitespace-pre-line">{ev.modelAnswer}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
