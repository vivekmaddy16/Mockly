'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Trophy, Target, CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw, 
  BookOpen, ChevronDown, ChevronUp, Award, Brain, BarChart2, Check, AlertCircle,
  FileText, ShieldCheck, Zap
} from 'lucide-react';
import { InterviewSession, QuestionEvaluation } from '@/types';
import confetti from 'canvas-confetti';

interface ResultsViewProps {
  session: InterviewSession;
}

// ─── Animated SVG Circular Score Ring Gauge ──────────────────
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', text: 'FAANG Ready' };
    if (s >= 60) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', text: 'Good Candidate' };
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', text: 'Needs Practice' };
  };

  const color = getColor(score);

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={radius} fill="none" stroke="#18181b" strokeWidth="10" />
        <circle
          cx="75" cy="75" r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 12px ${color.glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black text-white tracking-tight">{animatedScore}%</span>
        <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mt-0.5">{color.text}</span>
      </div>
    </div>
  );
};

export const ResultsView: React.FC<ResultsViewProps> = ({ session }) => {
  const [expandedQId, setExpandedQId] = useState<string | null>(session.questions[0]?.id || null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'technical' | 'behavioral'>('all');
  const confettiFired = useRef(false);

  const evaluationsArray = Object.values(session.evaluations);
  const totalScore = session.totalScore ?? Math.round(
    evaluationsArray.reduce((acc, ev) => acc + ev.score, 0) / (evaluationsArray.length || 1)
  );

  const avgTechnical = Math.round(
    evaluationsArray.reduce((acc, ev) => acc + (ev.technicalScore || ev.score), 0) / (evaluationsArray.length || 1)
  );
  const avgStructure = Math.round(
    evaluationsArray.reduce((acc, ev) => acc + (ev.structureScore || ev.score), 0) / (evaluationsArray.length || 1)
  );
  const avgClarity = Math.round(
    evaluationsArray.reduce((acc, ev) => acc + (ev.clarityScore || ev.score), 0) / (evaluationsArray.length || 1)
  );

  // Fire confetti for high performance
  useEffect(() => {
    if (totalScore >= 80 && !confettiFired.current && evaluationsArray.length > 0) {
      confettiFired.current = true;
      const duration = 2500;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#E8A200', '#f5b731', '#10b981', '#6366f1', '#a855f7'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#E8A200', '#f5b731', '#10b981', '#6366f1', '#a855f7'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [totalScore, evaluationsArray.length]);

  const filteredQuestions = session.questions.filter(q => {
    if (selectedFilter === 'all') return true;
    return q.type === selectedFilter;
  });

  return (
    <div className="page-glow relative">
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-300 text-xs font-extrabold tracking-wide uppercase">
            <Trophy className="w-4 h-4 text-brand-400" /> Executive Interview Report
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Performance <span className="text-gradient-gold">Scorecard</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            {session.targetRole} • {session.experienceLevel} • {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Executive Score Summary Card */}
        <div className="card-gradient-yellow rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <ScoreRing score={totalScore} />

            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-xl font-extrabold text-white">
                  {totalScore >= 80 ? '🎉 Exceptional Performance!' : totalScore >= 60 ? '👍 Solid Foundation' : '🎯 Targeted Practice Required'}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
                  {session.overallFeedback?.summary || 
                    `You scored ${totalScore}% overall across ${evaluationsArray.length} evaluated questions. Clear explanations and strong technical structure demonstrated.`}
                </p>
              </div>

              {/* 3-Metric Score Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <span className="block text-[10px] font-extrabold text-neutral-400 uppercase">Technical Depth</span>
                  <span className="text-lg font-black text-blue-400">{avgTechnical}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <span className="block text-[10px] font-extrabold text-neutral-400 uppercase">STAR Structure</span>
                  <span className="text-lg font-black text-brand-300">{avgStructure}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <span className="block text-[10px] font-extrabold text-neutral-400 uppercase">Articulation</span>
                  <span className="text-lg font-black text-purple-400">{avgClarity}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-6">
            <Link
              href="/setup"
              className="btn-yellow text-xs px-6 py-3 inline-flex items-center gap-2 font-bold shadow-lg shadow-brand-500/20"
            >
              <RotateCcw className="w-4 h-4" /> Start New Interview Session
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white hover:border-neutral-700 transition inline-flex items-center gap-2"
            >
              <BarChart2 className="w-4 h-4 text-emerald-400" /> Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Question Filter & List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" /> Detailed Question Analysis ({filteredQuestions.length})
            </h2>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              {(['all', 'technical', 'behavioral'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                    selectedFilter === f ? 'bg-brand-500 text-dark-bg shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Question Accordion Cards */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const ev = session.evaluations[q.id];
              const isExp = expandedQId === q.id;

              return (
                <div key={q.id} className="card-dark rounded-2xl overflow-hidden border border-white/10">
                  <button
                    onClick={() => setExpandedQId(isExp ? null : q.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-800/30 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-black text-sm shrink-0 ${
                        ev ? (ev.score >= 80 ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : ev.score >= 60 ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-red-500/15 border-red-500/30 text-red-400') : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                      }`}>
                        {ev ? `${ev.score}%` : 'N/A'}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-neutral-800">
                            {q.category}
                          </span>
                          <span className="text-xs text-neutral-500 font-bold">Q{idx + 1}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{q.questionText}</h4>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isExp ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                    </div>
                  </button>

                  {/* Expanded Content Side-by-Side Model Diff */}
                  {isExp && ev && (
                    <div className="p-6 border-t border-neutral-800/80 bg-neutral-950/40 space-y-6 text-xs animate-fade-in">
                      
                      {/* Candidate Answer vs Model Answer Split Screen */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase text-neutral-400 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-brand-400" /> Your Given Response
                          </span>
                          <p className="text-neutral-300 leading-relaxed font-mono whitespace-pre-line bg-black/40 p-3 rounded-xl border border-neutral-800/60">
                            {ev.userAnswer}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase text-emerald-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Ideal Candidate Model Answer
                          </span>
                          <p className="text-neutral-300 leading-relaxed font-mono whitespace-pre-line bg-black/40 p-3 rounded-xl border border-neutral-800/60">
                            {ev.modelAnswer}
                          </p>
                        </div>
                      </div>

                      {/* Detailed Highlights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
                          <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Strong Highlights
                          </h5>
                          <ul className="space-y-1 text-neutral-300">
                            {ev.positiveHighlights.map((pt, i) => <li key={i} className="flex items-start gap-1.5">• {pt}</li>)}
                          </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                          <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" /> Recommended Improvements
                          </h5>
                          <ul className="space-y-1 text-neutral-300">
                            {ev.areasToImprove.map((pt, i) => <li key={i} className="flex items-start gap-1.5">• {pt}</li>)}
                          </ul>
                        </div>
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
