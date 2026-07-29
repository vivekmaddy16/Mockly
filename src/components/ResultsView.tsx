'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Trophy, Target, CheckCircle2, Sparkles, ArrowRight, RotateCcw, 
  BookOpen, ChevronDown, ChevronUp, BarChart2, AlertCircle, FileText
} from 'lucide-react';
import { InterviewSession } from '@/types';
import confetti from 'canvas-confetti';

interface ResultsViewProps {
  session: InterviewSession;
}

// ─── Animated SVG Score Ring Gauge ───────────────────────────
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
    if (s >= 80) return { stroke: '#10b981', text: 'FAANG Ready' };
    if (s >= 60) return { stroke: '#E8A200', text: 'Good Candidate' };
    return { stroke: '#E54B54', text: 'Needs Practice' };
  };

  const color = getColor(score);

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={radius} fill="none" stroke="#E4E8DC" strokeWidth="10" />
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
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display font-black text-4xl text-charcoal tracking-tight">{animatedScore}%</span>
        <span className="text-[10px] text-charcoal/60 font-extrabold uppercase tracking-wider mt-0.5">{color.text}</span>
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

  // Fire confetti for high scores
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
          colors: ['#1B1E16', '#E54B54', '#10b981', '#7BD695'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#1B1E16', '#E54B54', '#10b981', '#7BD695'],
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
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-charcoal/10 text-charcoal text-xs font-extrabold shadow-sm">
          <Trophy className="w-4 h-4 text-coral" /> Executive Interview Scorecard
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight">
          Session Performance Report
        </h1>
        <p className="text-sm font-bold text-charcoal/60 max-w-xl mx-auto">
          {session.targetRole} • {session.experienceLevel} • {new Date(session.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Executive Score Summary Card */}
      <div className="card-cream p-7 sm:p-9 border border-white shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <ScoreRing score={totalScore} />

          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div className="space-y-1">
              <h3 className="font-display font-black text-2xl text-charcoal">
                {totalScore >= 80 ? '🎉 Exceptional Performance!' : totalScore >= 60 ? '👍 Solid Foundation' : '🎯 Targeted Practice Required'}
              </h3>
              <p className="text-xs font-medium text-charcoal/70 leading-relaxed max-w-xl">
                {session.overallFeedback?.summary || 
                  `You scored ${totalScore}% overall across ${evaluationsArray.length} evaluated questions. Clear explanations and strong technical structure demonstrated.`}
              </p>
            </div>

            {/* 3-Metric Score Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 text-center">
                <span className="block text-[10px] font-extrabold uppercase text-charcoal/50">Technical Depth</span>
                <span className="font-display font-black text-xl text-charcoal">{avgTechnical}%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 text-center">
                <span className="block text-[10px] font-extrabold uppercase text-charcoal/50">STAR Structure</span>
                <span className="font-display font-black text-xl text-charcoal">{avgStructure}%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 text-center">
                <span className="block text-[10px] font-extrabold uppercase text-charcoal/50">Articulation</span>
                <span className="font-display font-black text-xl text-charcoal">{avgClarity}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/10 pt-6">
          <Link href="/setup" className="btn-dual-pill">
            <div className="icon-badge">
              <RotateCcw className="w-4 h-4 text-charcoal" />
            </div>
            <span className="btn-label">Start New Session</span>
          </Link>

          <Link href="/dashboard" className="btn-dual-pill-light">
            <div className="icon-badge">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="btn-label">Go to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Question Filter & List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-display font-black text-xl text-charcoal flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-coral" /> Question Analysis ({filteredQuestions.length})
          </h2>

          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-charcoal/10 text-xs">
            {(['all', 'technical', 'behavioral'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3.5 py-1.5 rounded-full font-bold capitalize transition ${
                  selectedFilter === f ? 'bg-charcoal text-cream shadow-sm' : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Question Accordions */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const ev = session.evaluations[q.id];
            const isExp = expandedQId === q.id;

            return (
              <div key={q.id} className="card-cream overflow-hidden border border-white">
                <button
                  onClick={() => setExpandedQId(isExp ? null : q.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/50 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-charcoal text-cream font-display font-black text-sm flex items-center justify-center shrink-0">
                      {ev ? `${ev.score}%` : 'N/A'}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white text-charcoal border border-charcoal/10">
                          {q.category}
                        </span>
                        <span className="text-xs text-charcoal/60 font-bold">Q{idx + 1}</span>
                      </div>
                      <h4 className="font-display font-extrabold text-sm text-charcoal truncate">{q.questionText}</h4>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isExp ? <ChevronUp className="w-5 h-5 text-charcoal" /> : <ChevronDown className="w-5 h-5 text-charcoal/60" />}
                  </div>
                </button>

                {/* Expanded Side-by-Side Model Answer Comparison */}
                {isExp && ev && (
                  <div className="p-6 border-t border-charcoal/10 bg-white/60 space-y-5 text-xs animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-charcoal/10 space-y-2">
                        <span className="text-[10px] font-black uppercase text-charcoal/60 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-coral" /> Your Given Response
                        </span>
                        <p className="text-charcoal leading-relaxed font-mono whitespace-pre-line bg-cream p-3 rounded-xl border border-charcoal/5">
                          {ev.userAnswer}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-charcoal/10 space-y-2">
                        <span className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Ideal Candidate Model Answer
                        </span>
                        <p className="text-charcoal leading-relaxed font-mono whitespace-pre-line bg-cream p-3 rounded-xl border border-charcoal/5">
                          {ev.modelAnswer}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-charcoal/10 space-y-2">
                        <h5 className="font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Strong Highlights
                        </h5>
                        <ul className="space-y-1 text-charcoal/80 font-medium">
                          {ev.positiveHighlights.map((pt, i) => <li key={i}>• {pt}</li>)}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-charcoal/10 space-y-2">
                        <h5 className="font-bold text-amber-700 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" /> Recommended Improvements
                        </h5>
                        <ul className="space-y-1 text-charcoal/80 font-medium">
                          {ev.areasToImprove.map((pt, i) => <li key={i}>• {pt}</li>)}
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
  );
};
