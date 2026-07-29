'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, Mic, MicOff, Volume2, VolumeX, Clock, Lightbulb, Send, Sparkles, 
  CheckCircle2, ArrowRight, Code2, AlertTriangle, HelpCircle, X, SlidersHorizontal,
  ChevronRight, Award, Zap
} from 'lucide-react';
import { InterviewSession, QuestionEvaluation } from '@/types';
import { evaluateAnswer } from '@/lib/gemini';
import { updateSessionEvaluation } from '@/lib/storage';

interface InterviewRoomProps {
  session: InterviewSession;
}

// ─── Waveform Canvas Component ───────────────────────────────
const AudioWaveformCanvas: React.FC<{ isRecording: boolean }> = ({ isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isRecording) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = 3;
      const barGap = 3;
      const totalBars = Math.floor(width / (barWidth + barGap));

      phase += 0.08;

      for (let i = 0; i < totalBars; i++) {
        const x = i * (barWidth + barGap);
        // Compute pseudo-random dynamic heights simulating audio frequencies
        const noise = Math.sin(i * 0.3 + phase) * Math.cos(i * 0.2 - phase);
        const barHeight = Math.max(4, Math.abs(noise) * (height - 6));

        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={32}
      className="rounded-lg bg-black/40 border border-purple-500/20"
    />
  );
};

export const InterviewRoom: React.FC<InterviewRoomProps> = ({ session: initialSession }) => {
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession>(initialSession);
  const [currentIdx, setCurrentIdx] = useState(initialSession.currentQuestionIndex || 0);
  const currentQuestion = session.questions[currentIdx];
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showStarDrawer, setShowStarDrawer] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [interimText, setInterimText] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const hasUnsavedProgress = useRef(false);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setSeconds(p => p + 1), 1000);
    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
    };
  }, []);

  // Warn before leaving mid-interview
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedProgress.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track unsaved progress
  useEffect(() => {
    hasUnsavedProgress.current = userAnswer.trim().length > 0;
  }, [userAnswer]);

  const speakQuestion = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(currentQuestion.questionText);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [isSpeaking, currentQuestion.questionText]);

  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech Recognition not supported in this browser. Please type your answer.'); return; }
    if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); setInterimText(''); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      if (finalTranscript) {
        setUserAnswer(p => (p ? `${p} ${finalTranscript}` : finalTranscript));
        setInterimText('');
      } else {
        setInterimText(interimTranscript);
      }
    };
    r.onend = () => { setIsListening(false); setInterimText(''); };
    r.onerror = () => { setIsListening(false); setInterimText(''); };
    recognitionRef.current = r; r.start(); setIsListening(true);
  }, [isListening]);

  const currentEvaluation: QuestionEvaluation | undefined = session.evaluations[currentQuestion.id];

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateAnswer(currentQuestion, userAnswer, session.targetRole);
      const updated = await updateSessionEvaluation(session.id, currentQuestion.id, result);
      if (updated) setSession(updated);
      hasUnsavedProgress.current = false;
    } catch (e) { console.error(e); }
    finally { setIsEvaluating(false); }
  };

  const handleNextQuestion = () => {
    setUserAnswer(''); setShowHint(false); setSeconds(0);
    hasUnsavedProgress.current = false;
    if (isSpeaking && typeof window !== 'undefined') { window.speechSynthesis.cancel(); setIsSpeaking(false); }
    if (currentIdx + 1 < session.questions.length) setCurrentIdx(p => p + 1);
    else router.push(`/interview/${session.id}/results`);
  };

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const progress = ((currentIdx + 1) / session.questions.length) * 100;

  return (
    <div className="page-glow relative">
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
        
        {/* ─── Top Studio HUD Bar ───────────────────────────────── */}
        <div className="card-dark rounded-2xl p-4 flex items-center justify-between gap-4 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Pulsing Aura visualizer when speaking */}
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 transition-all ${
                isSpeaking ? 'ring-4 ring-indigo-500/40 animate-pulse scale-105' : ''
              }`}>
                <Bot className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-dark-bg rounded-full shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">AI Interviewer</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold hidden sm:inline">
                  {session.targetRole}
                </span>
              </div>
              <p className="text-xs text-neutral-400">{session.experienceLevel}</p>
            </div>
          </div>

          {/* Desktop Stepper */}
          <div className="hidden md:flex items-center gap-2">
            {session.questions.map((q, idx) => {
              const done = !!session.evaluations[q.id];
              const cur = idx === currentIdx;
              return (
                <div key={q.id} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  cur ? 'bg-gradient-to-r from-brand-500/20 to-brand-400/20 text-brand-300 border-brand-500/40 shadow-sm'
                  : done ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-neutral-900/60 text-neutral-600 border-neutral-800'
                }`}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" /> : null}
                  Q{idx+1}
                </div>
              );
            })}
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStarDrawer(!showStarDrawer)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-brand-500/30 transition flex items-center gap-1 text-xs font-semibold"
              title="STAR Framework Guide"
            >
              <HelpCircle className="w-4 h-4 text-brand-400" />
              <span className="hidden lg:inline">STAR Method</span>
            </button>

            <button
              onClick={speakQuestion}
              className={`p-2 rounded-xl border transition ${
                isSpeaking
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
              title={isSpeaking ? 'Mute AI' : 'Listen Question'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-indigo-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono font-bold text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-brand-400" /> {fmt(seconds)}
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ─── Main Question Card ───────────────────────────────── */}
        <div className="card-gradient-yellow rounded-3xl p-6 sm:p-8 space-y-5 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-brand-500/15 text-brand-300 border border-brand-500/30 text-xs font-extrabold uppercase tracking-wider shadow-sm">
                {currentQuestion.category}
              </span>
              <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${
                currentQuestion.difficulty === 'Hard' ? 'bg-red-500/15 text-red-400 border-red-500/30'
                : currentQuestion.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-400">
              Question {currentIdx+1} of {session.questions.length}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-relaxed tracking-tight relative z-10">
            {currentQuestion.questionText}
          </h2>

          {currentQuestion.contextOrCode && (
            <div className="relative z-10 rounded-2xl overflow-hidden border border-neutral-800 bg-black/70 p-4">
              <pre className="text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed">{currentQuestion.contextOrCode}</pre>
            </div>
          )}

          <div className="relative z-10 pt-1">
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition"
            >
              <Lightbulb className="w-4 h-4 text-brand-400" /> {showHint ? 'Hide Concept Keypoints' : 'Need a Keypoint Hint?'}
            </button>
            {showHint && (
              <div className="mt-3 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200 space-y-2 animate-fade-in backdrop-blur-md">
                <p className="font-bold text-brand-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Expected Key Focus Points:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-neutral-300 font-medium">
                  {currentQuestion.expectedKeyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ─── Answer Input & Speech Visualizer ────────────────── */}
        {!currentEvaluation ? (
          <div className="card-dark rounded-3xl p-6 sm:p-8 space-y-4 border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <label className="text-xs font-extrabold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-400" /> Candidate Response
              </label>

              <div className="flex items-center gap-3">
                {/* Dynamic Waveform Visualizer Canvas */}
                <AudioWaveformCanvas isRecording={isListening} />

                <button
                  onClick={toggleListening}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isListening
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 ring-4 ring-red-500/20 animate-pulse'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white hover:border-brand-500/40'
                  }`}
                >
                  {isListening ? (
                    <><MicOff className="w-4 h-4 text-red-400" /> Recording...</>
                  ) : (
                    <><Mic className="w-4 h-4 text-brand-400" /> Speak Answer (STT)</>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={7}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Structure your answer clearly (STAR framework recommended: Situation, Task, Action, Result)..."
                className="w-full px-4 py-3 bg-[#0a0a14] border border-neutral-800/90 rounded-2xl text-neutral-100 text-sm focus:outline-none focus:border-brand-500/50 transition placeholder:text-neutral-600 font-mono resize-y leading-relaxed"
              />
              {interimText && (
                <div className="px-4 py-2 text-xs text-indigo-400 italic border-t border-neutral-800/80 bg-indigo-500/5 flex items-center gap-2">
                  <Mic className="w-3 h-3 text-red-400 animate-pulse" /> {interimText}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
              <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Pro-tip: State Big-O complexity for technical code
              </p>

              <button
                onClick={handleSubmitAnswer}
                disabled={isEvaluating || !userAnswer.trim()}
                className="btn-yellow text-xs px-7 py-3.5 inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-brand-500/20 font-bold"
              >
                {isEvaluating ? (
                  <><div className="w-4 h-4 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin" /> Evaluating with AI...</>
                ) : (
                  <><Send className="w-4 h-4" /> Submit for Evaluation</>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ─── Immediate Question Feedback Card ─────────────────── */
          <div className="card-dark rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in border border-brand-500/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-dark-bg border border-brand-400 flex items-center justify-center font-black text-xl shadow-lg shadow-brand-500/20">
                  {currentEvaluation.score}%
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Evaluation Generated</h3>
                  <p className="text-xs text-neutral-400">Detailed AI analysis of your response</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { label: 'Structure', score: currentEvaluation.structureScore, color: 'text-brand-300' },
                  { label: 'Technical', score: currentEvaluation.technicalScore, color: 'text-blue-400' },
                  { label: 'Clarity', score: currentEvaluation.clarityScore, color: 'text-purple-400' },
                ].map((m, i) => (
                  <div key={i} className="text-center px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                    <span className="block text-neutral-500 text-[10px] uppercase font-bold">{m.label}</span>
                    <span className={`font-extrabold text-sm ${m.color}`}>{m.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Strong Highlights</h4>
                <ul className="space-y-1.5 text-neutral-300">
                  {currentEvaluation.positiveHighlights.map((pt, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">•</span>{pt}</li>)}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
                <h4 className="font-bold text-amber-400 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Areas to Expand</h4>
                <ul className="space-y-1.5 text-neutral-300">
                  {currentEvaluation.areasToImprove.map((pt, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">•</span>{pt}</li>)}
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090d16] border border-white/10 space-y-2 text-xs">
              <h4 className="font-bold text-brand-300 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-brand-400" /> Ideal Model Answer</h4>
              <p className="text-neutral-300 leading-relaxed font-mono whitespace-pre-line">{currentEvaluation.modelAnswer}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="btn-yellow text-xs px-7 py-3.5 inline-flex items-center gap-2 shadow-lg shadow-brand-500/20 font-bold"
              >
                {currentIdx+1 < session.questions.length ? 'Next Question' : 'View Executive Report'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── STAR Framework Slide-Over Drawer ──────────────────── */}
      {showStarDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end modal-overlay animate-fade-in" onClick={() => setShowStarDrawer(false)}>
          <div className="w-full max-w-md bg-[#090d16] border-l border-white/10 h-full p-6 space-y-6 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2 text-brand-400 font-bold">
                <Award className="w-5 h-5" /> STAR Response Method
              </div>
              <button onClick={() => setShowStarDrawer(false)} className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Use the STAR framework to structure behavioral and technical system design answers for maximum impact.
            </p>

            <div className="space-y-4">
              {[
                { letter: 'S', title: 'Situation', desc: 'Set the context. Describe the specific situation, challenge, or project background.' },
                { letter: 'T', title: 'Task', desc: 'Define your role and what responsibilities or goals you were tasked with resolving.' },
                { letter: 'A', title: 'Action', desc: 'Explain the technical steps, algorithms, or decisions YOU executed to address it.' },
                { letter: 'R', title: 'Result', desc: 'Share quantifiable outcomes, metrics, latency improvements, or lessons learned.' },
              ].map((step, i) => (
                <div key={i} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 font-black text-sm flex items-center justify-center shrink-0 border border-brand-500/30">
                    {step.letter}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowStarDrawer(false)} className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white">
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
