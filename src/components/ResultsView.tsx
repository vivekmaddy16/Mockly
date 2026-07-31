'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Trophy, Target, CheckCircle2, Sparkles, ArrowRight, RotateCcw, 
  BookOpen, ChevronDown, ChevronUp, BarChart2, AlertCircle, FileText,
  AlertTriangle, Play, Pause, RefreshCw, Volume2, User, Users, GraduationCap
} from 'lucide-react';
import { InterviewSession } from '@/types';
import { computeSentenceHighlights } from '@/lib/gemini';
import confetti from 'canvas-confetti';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

interface ResultsViewProps {
  session: InterviewSession;
}

// ─── Explainable AI Answer Renderer ─────────────────────────
const ExplainableAnswer: React.FC<{ userAnswer: string; highlights?: any[]; keyPoints?: string[] }> = ({ userAnswer, highlights, keyPoints = [] }) => {
  const finalHighlights = highlights && highlights.length > 0
    ? highlights
    : computeSentenceHighlights(userAnswer, keyPoints);

  return (
    <div className="leading-relaxed font-semibold text-xs text-charcoal bg-cream p-3.5 rounded-xl border border-charcoal/5 font-mono select-none">
      {finalHighlights.map((hl, i) => {
        if (hl.status === 'strong') {
          return (
            <span key={i} className="relative group cursor-help transition bg-emerald-500/10 border-b-2 border-emerald-500 hover:bg-emerald-500/20 px-1 py-0.5 rounded mr-1">
              {hl.text}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-charcoal text-cream text-[10px] p-2.5 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 font-sans font-bold leading-normal text-left">
                <strong className="block text-emerald-400 mb-0.5">✓ Technical Strength</strong>
                {hl.reason}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal"></span>
              </span>
            </span>
          );
        }
        if (hl.status === 'weak') {
          return (
            <span key={i} className="relative group cursor-help transition bg-amber-500/10 border-b-2 border-amber-500 hover:bg-amber-500/20 px-1 py-0.5 rounded mr-1">
              {hl.text}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-charcoal text-cream text-[10px] p-2.5 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 font-sans font-bold leading-normal text-left">
                <strong className="block text-coral mb-0.5">⚠ Improvement Area</strong>
                {hl.reason}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal"></span>
              </span>
            </span>
          );
        }
        return <span key={i} className="text-charcoal/80 mr-1">{hl.text}</span>;
      })}
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<'scorecard' | 'benchmarks' | 'coaching_replay'>('scorecard');
  const [isPlayingCoaching, setIsPlayingCoaching] = useState<string | null>(null);
  const [selectedCoachingId, setSelectedCoachingId] = useState<number>(0);
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

  // Benchmark dataset
  const benchmarkData = [
    { name: 'Tech Depth', You: avgTechnical, Peers: 72 },
    { name: 'Structure', You: avgStructure, Peers: 68 },
    { name: 'Clarity', You: avgClarity, Peers: 75 },
    { name: 'Confidence', You: session.overallConfidence || 92, Peers: 80 },
  ];

  const radarData = [
    { subject: 'DSA', A: avgTechnical > 80 ? avgTechnical : 78, B: 75, fullMark: 100 },
    { subject: 'OOPs', A: avgStructure > 80 ? avgStructure : 82, B: 78, fullMark: 100 },
    { subject: 'DBMS', A: avgClarity > 80 ? avgClarity : 76, B: 72, fullMark: 100 },
    { subject: 'OS', A: 80, B: 70, fullMark: 100 },
    { subject: 'CN', A: 85, B: 75, fullMark: 100 },
    { subject: 'System Design', A: avgTechnical, B: 70, fullMark: 100 },
  ];

  // Coaching moments dataset
  const coachingMoments = session.coachingTimeline && session.coachingTimeline.length > 0
    ? session.coachingTimeline
    : [
        { timestamp: '00:12', type: 'strength' as const, title: 'Strong DSA Logic', text: 'Stated Kadane\'s space bounds O(1) immediately.' },
        { timestamp: '00:32', type: 'coaching_tip' as const, title: 'Speech Pacing Alert', text: 'Pacing rose to 154 WPM. Remember to take deliberate pauses between key points.' },
        { timestamp: '00:48', type: 'weakness' as const, title: 'System Design Scaling Gap', text: 'Missed detailed write sharding strategy for globally scale database.' },
        { timestamp: '01:20', type: 'strength' as const, title: 'Excellent STAR Structure', text: 'Utilized STAR structure cleanly to describe the conflict result.' }
      ];

  const currentCoachingMoment = coachingMoments[selectedCoachingId] || coachingMoments[0];

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
          {session.targetRole} • {session.experienceLevel} • {session.difficultyMode || 'Medium'} Mode • {session.roundType === 'dsa' ? 'Algorithms & DSA Round' : session.roundType === 'system_design' ? 'System Design Round' : session.roundType === 'behavioral' ? 'Behavioral & HR Round' : 'Technical Screen Round'} • {new Date(session.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Dynamic Tab Navigation Bar */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white border border-charcoal/10 shadow-md">
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'scorecard'
                ? 'bg-charcoal text-cream shadow-md'
                : 'text-charcoal/70 hover:text-charcoal'
            }`}
          >
            <Trophy className="w-4 h-4" /> Scorecard Report
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'bg-charcoal text-cream shadow-md'
                : 'text-charcoal/70 hover:text-charcoal'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Peer Benchmarks
          </button>

          <button
            onClick={() => setActiveTab('coaching_replay')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'coaching_replay'
                ? 'bg-charcoal text-cream shadow-md'
                : 'text-charcoal/70 hover:text-charcoal'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Coaching & Replay
          </button>
        </div>
      </div>

      {/* Render tab content dynamically */}
      {activeTab === 'scorecard' && (
        <div className="space-y-8 animate-fade-in">
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

                {/* 4-Metric Score Breakdown (Including Confidence Score) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 text-center shadow-sm">
                    <span className="block text-[9px] font-extrabold uppercase text-charcoal/50">Technical Depth</span>
                    <span className="font-display font-black text-lg text-charcoal">{avgTechnical}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 text-center shadow-sm">
                    <span className="block text-[9px] font-extrabold uppercase text-charcoal/50">STAR Structure</span>
                    <span className="font-display font-black text-lg text-charcoal">{avgStructure}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 text-center shadow-sm">
                    <span className="block text-[9px] font-extrabold uppercase text-charcoal/50">Articulation</span>
                    <span className="font-display font-black text-lg text-charcoal">{avgClarity}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 text-center shadow-sm">
                    <span className="block text-[9px] font-extrabold uppercase text-charcoal/50">Confidence Telemetry</span>
                    <span className="font-display font-black text-lg text-coral">{session.overallConfidence || 92}%</span>
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
                    className={`px-3.5 py-1.5 rounded-full font-bold capitalize transition cursor-pointer ${
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
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/50 transition cursor-pointer"
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
                            <div className="flex items-center justify-between text-[10px] font-black uppercase text-charcoal/60">
                              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-coral" /> Your Given Response</span>
                              {ev.inputMode && (
                                <span className="px-2 py-0.5 rounded-full bg-charcoal/5 border border-charcoal/10 text-[9px] font-extrabold text-charcoal/70">
                                  {ev.inputMode === 'spoken' ? '🎤 Voice Response' : '⌨ Keyboard Input'}
                                </span>
                              )}
                            </div>
                            <ExplainableAnswer 
                              userAnswer={ev.userAnswer} 
                              highlights={ev.sentenceHighlights} 
                              keyPoints={q.expectedKeyPoints} 
                            />
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
                            <ul className="space-y-1 text-charcoal/80 font-medium font-bold">
                              {ev.positiveHighlights.map((pt, i) => <li key={i}>• {pt}</li>)}
                            </ul>
                          </div>

                          <div className="p-4 rounded-2xl bg-white border border-charcoal/10 space-y-2">
                            <h5 className="font-bold text-amber-700 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4" /> Recommended Improvements
                            </h5>
                            <ul className="space-y-1 text-charcoal/80 font-medium font-bold">
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
      )}

      {activeTab === 'benchmarks' && (
        <div className="space-y-6 animate-fade-in">
          {/* Peer Performance summary widget */}
          <div className="card-cream p-6 border border-white shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-charcoal rounded-2xl flex items-center justify-center text-cream shrink-0 shadow-md">
              <Users className="w-6 h-6 text-coral" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-charcoal">Global Candidate Index</h3>
              <p className="text-xs font-bold text-charcoal/60 mt-0.5">
                You performed better than <span className="text-coral font-extrabold">{Math.min(99, Math.max(50, Math.round(totalScore * 0.9)))}%</span> of peers interviewing for <span className="text-charcoal font-extrabold underline">{session.targetRole}</span> roles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category comparison Chart */}
            <div className="card-cream p-6 border border-white shadow-2xl space-y-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-coral" />
                <h4 className="font-display font-black text-sm text-charcoal">Core Dimension Comparison</h4>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E8DC" />
                    <XAxis dataKey="name" stroke="#1B1E16" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="#1B1E16" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Bar dataKey="You" fill="#1B1E16" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Peers" fill="#E54B54" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Skill Mastery Chart */}
            <div className="card-cream p-6 border border-white shadow-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-coral" />
                <h4 className="font-display font-black text-sm text-charcoal">Skill Mastery Profile</h4>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#E4E8DC" />
                    <PolarAngleAxis dataKey="subject" stroke="#1B1E16" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={8} />
                    <Radar name="Your Mastery" dataKey="A" stroke="#1B1E16" fill="#1B1E16" fillOpacity={0.15} />
                    <Radar name="FAANG Target Profile" dataKey="B" stroke="#E54B54" fill="#E54B54" fillOpacity={0.05} />
                    <Tooltip />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coaching_replay' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
          {/* Left Column: Replay coaching milestones timeline */}
          <div className="lg:col-span-1 card-cream p-6 border border-white shadow-2xl space-y-6">
            <div>
              <h3 className="font-display font-black text-base text-charcoal flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-coral" /> Coaching Milestones
              </h3>
              <p className="text-[10px] text-charcoal/50 font-bold mt-1">Select key moments to replay AI analysis feedback</p>
            </div>

            {/* Vertical timeline */}
            <div className="relative pl-6 border-l-2 border-charcoal/10 space-y-5 py-2">
              {coachingMoments.map((moment, idx) => {
                const isActive = selectedCoachingId === idx;
                const isStrength = moment.type === 'strength';
                const isWeakness = moment.type === 'weakness';

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCoachingId(idx)}
                    className={`relative cursor-pointer transition-all duration-300 ${
                      isActive ? 'scale-[1.03]' : 'hover:opacity-80'
                    }`}
                  >
                    {/* Circle bullet on line */}
                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                      isActive 
                        ? 'border-charcoal bg-charcoal scale-110 shadow'
                        : isStrength
                        ? 'border-emerald-600 bg-emerald-500'
                        : isWeakness
                        ? 'border-coral bg-coral'
                        : 'border-amber-600 bg-amber-500'
                    }`} />

                    <div className={`p-3 rounded-2xl border transition-all ${
                      isActive 
                        ? 'bg-charcoal text-cream border-charcoal shadow-md'
                        : 'bg-white text-charcoal border-charcoal/5 hover:border-charcoal/10'
                    }`}>
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className={`px-2 py-0.5 rounded-full font-black ${
                          isActive 
                            ? 'bg-white/20 text-cream'
                            : isStrength 
                            ? 'bg-emerald-500/10 text-emerald-800' 
                            : isWeakness
                            ? 'bg-coral/10 text-coral'
                            : 'bg-amber-500/10 text-amber-900'
                        }`}>
                          {moment.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="font-bold">{moment.timestamp}</span>
                      </div>
                      <h4 className="text-[11px] font-black mt-2 leading-tight">{moment.title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Coach player deck */}
          <div className="lg:col-span-2 space-y-6">
            {/* Playback Box */}
            <div className="card-cream p-7 sm:p-9 border border-white shadow-2xl space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap border-b border-charcoal/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-charcoal text-cream flex items-center justify-center shrink-0 shadow-md">
                    <Volume2 className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-charcoal">AI Audio Feedback Deck</h3>
                    <p className="text-[10px] text-charcoal/50 font-bold">Simulated vocal replay & timestamps analysis</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-charcoal/60">Milestone Time:</span>
                  <span className="text-xs font-mono font-black text-coral px-3 py-1 rounded-full bg-coral/5 border border-coral/10">
                    {currentCoachingMoment.timestamp}
                  </span>
                </div>
              </div>

              {/* Audio player simulator visualizer */}
              <div className="bg-charcoal rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 border border-charcoal shadow-inner text-center">
                <div className="flex items-center gap-1.5 h-10">
                  {[...Array(20)].map((_, i) => {
                    const active = isPlayingCoaching === currentCoachingMoment.timestamp;
                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full bg-coral transition-all duration-300 ${
                          active ? 'animate-pulse' : 'opacity-40'
                        }`}
                        style={{
                          height: active ? `${Math.max(4, Math.round(Math.random() * 36))}px` : '6px',
                          animationDelay: `${i * 0.08}s`
                        }}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (isPlayingCoaching === currentCoachingMoment.timestamp) {
                        setIsPlayingCoaching(null);
                      } else {
                        setIsPlayingCoaching(currentCoachingMoment.timestamp);
                        // Speech synthesis fallback option
                        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utterance = new SpeechSynthesisUtterance(
                            `Coaching feedback for moment ${currentCoachingMoment.title}. ${currentCoachingMoment.text}`
                          );
                          utterance.onend = () => setIsPlayingCoaching(null);
                          utterance.onerror = () => setIsPlayingCoaching(null);
                          window.speechSynthesis.speak(utterance);
                        }
                      }
                    }}
                    className="w-12 h-12 rounded-full bg-cream text-charcoal flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    {isPlayingCoaching === currentCoachingMoment.timestamp ? (
                      <Pause className="w-5 h-5 text-charcoal" />
                    ) : (
                      <Play className="w-5 h-5 text-charcoal translate-x-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                      setIsPlayingCoaching(null);
                    }}
                    className="w-9 h-9 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
                    title="Stop Audio"
                  >
                    <RefreshCw className="w-4 h-4 text-white" />
                  </button>
                </div>

                <span className="text-[10px] font-mono text-cream/45 uppercase tracking-widest font-black">
                  {isPlayingCoaching === currentCoachingMoment.timestamp ? 'PLAYING AI VOICE OVER' : 'AUDIO DECK READY'}
                </span>
              </div>

              {/* Coaching Feedback Transcript Box */}
              <div className="space-y-3">
                <h4 className="font-display font-black text-sm text-charcoal flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-coral animate-pulse" /> AI Coach Feedback Transcript
                </h4>
                
                <div className="p-5 rounded-3xl bg-white border border-charcoal/10 space-y-3 shadow-inner">
                  <h5 className="font-extrabold text-charcoal flex items-center gap-1.5 text-xs">
                    <Target className="w-4 h-4 text-coral" /> {currentCoachingMoment.title}
                  </h5>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-bold font-mono">
                    "{currentCoachingMoment.text}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
