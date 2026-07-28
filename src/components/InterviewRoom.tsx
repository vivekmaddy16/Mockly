'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, Mic, MicOff, Volume2, VolumeX, Clock, Lightbulb, Send, Sparkles, 
  CheckCircle2, ArrowRight, Code2, AlertTriangle
} from 'lucide-react';
import { InterviewSession, QuestionEvaluation } from '@/types';
import { evaluateAnswer } from '@/lib/gemini';
import { updateSessionEvaluation } from '@/lib/storage';

interface InterviewRoomProps {
  session: InterviewSession;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({ session: initialSession }) => {
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession>(initialSession);
  const [currentIdx, setCurrentIdx] = useState(initialSession.currentQuestionIndex || 0);
  const currentQuestion = session.questions[currentIdx];
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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
    const SR = (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition 
      || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) { alert('Speech Recognition not supported. Please type your answer.'); return; }
    if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); setInterimText(''); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true;
    r.onresult = (e: SpeechRecognitionEvent) => {
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
      const updated = updateSessionEvaluation(session.id, currentQuestion.id, result);
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
        
        {/* Top Bar */}
        <div className="card-dark rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="icon-box icon-box-yellow">
                <Bot className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-dark-bg rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">AI Interviewer</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800 font-medium hidden sm:inline">
                  {session.targetRole}
                </span>
              </div>
              <p className="text-xs text-neutral-500">{session.experienceLevel}</p>
            </div>
          </div>

          {/* Desktop Stepper */}
          <div className="hidden md:flex items-center gap-2">
            {session.questions.map((q, idx) => {
              const done = !!session.evaluations[q.id];
              const cur = idx === currentIdx;
              return (
                <div key={q.id} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                  cur ? 'bg-brand-500/15 text-brand-300 border-brand-500/30'
                  : done ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-neutral-900/60 text-neutral-600 border-neutral-800'
                }`}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" /> : `Q${idx+1}`}
                </div>
              );
            })}
          </div>

          {/* Mobile Progress Pill */}
          <div className="md:hidden flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-300">
              Q{currentIdx + 1}<span className="text-neutral-500 font-normal">/ {session.questions.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={speakQuestion} className={`p-2 rounded-xl border transition ${
              isSpeaking ? 'bg-brand-500/15 text-brand-300 border-brand-500/30 animate-pulse' : 'bg-neutral-900/80 text-neutral-500 border-neutral-800 hover:text-white'
            }`}>
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-mono text-neutral-400">
              <Clock className="w-3.5 h-3.5" /> {fmt(seconds)}
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden w-full h-1 rounded-full bg-neutral-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="card-gradient-yellow rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20 text-xs font-bold uppercase tracking-wider">
                {currentQuestion.category}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                currentQuestion.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : currentQuestion.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <span className="text-xs text-neutral-500 shrink-0">Q {currentIdx+1}/{session.questions.length}</span>
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          {currentQuestion.contextOrCode && (
            <pre className="p-4 rounded-xl bg-black/60 border border-neutral-800 text-neutral-200 font-mono text-xs overflow-x-auto">{currentQuestion.contextOrCode}</pre>
          )}

          <div>
            <button onClick={() => setShowHint(!showHint)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition">
              <Lightbulb className="w-4 h-4" /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>
            {showHint && (
              <div className="mt-3 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/15 text-xs text-brand-200/90 space-y-2 animate-fade-in">
                <p className="font-semibold text-brand-300"><Sparkles className="w-3.5 h-3.5 inline mr-1" />Key Focus Areas:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-neutral-300">
                  {currentQuestion.expectedKeyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Answer / Evaluation */}
        {!currentEvaluation ? (
          <div className="card-dark rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-400" /> Your Response
              </label>
              <button onClick={toggleListening} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isListening ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse' : 'bg-neutral-900/80 text-neutral-500 border-neutral-800 hover:text-white'
              }`}>
                {isListening ? <><MicOff className="w-3.5 h-3.5" /> Recording...</> : <><Mic className="w-3.5 h-3.5" /> Speak (STT)</>}
              </button>
            </div>
            <div className="relative">
              <textarea rows={7} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or dictate your answer here..."
                className="w-full px-4 py-3 bg-[#0e0e0e] border border-neutral-800 rounded-2xl text-neutral-100 text-sm focus:outline-none focus:border-brand-500/40 transition placeholder:text-neutral-600 font-mono resize-y"
              />
              {interimText && (
                <div className="px-4 py-2 text-xs text-neutral-500 italic border-t border-neutral-800/50">
                  <Mic className="w-3 h-3 inline mr-1 text-red-400 animate-pulse" />{interimText}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end pt-1">
              <button onClick={handleSubmitAnswer} disabled={isEvaluating || !userAnswer.trim()}
                className="btn-yellow text-xs px-6 py-3 inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none">
                {isEvaluating ? <><div className="w-4 h-4 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin" /> Evaluating...</>
                : <><Send className="w-4 h-4" /> Submit for AI Review</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="card-dark rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in border border-brand-500/15">
            {/* Score Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/15 text-brand-400 border border-brand-500/20 flex items-center justify-center font-extrabold text-xl">
                  {currentEvaluation.score}%
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Evaluation Complete</h3>
                  <p className="text-xs text-neutral-500">AI-powered feedback generated</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { label: 'Structure', score: currentEvaluation.structureScore, color: 'text-brand-300' },
                  { label: 'Technical', score: currentEvaluation.technicalScore, color: 'text-blue-400' },
                  { label: 'Clarity', score: currentEvaluation.clarityScore, color: 'text-purple-400' },
                ].map((m, i) => (
                  <div key={i} className="text-center px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                    <span className="block text-neutral-500 text-[10px]">{m.label}</span>
                    <span className={`font-bold ${m.color}`}>{m.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2.5">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Strengths</h4>
                <ul className="space-y-1.5 text-neutral-300">
                  {currentEvaluation.positiveHighlights.map((pt, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">•</span>{pt}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-2.5">
                <h4 className="font-bold text-amber-400 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Improvements</h4>
                <ul className="space-y-1.5 text-neutral-300">
                  {currentEvaluation.areasToImprove.map((pt, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">•</span>{pt}</li>)}
                </ul>
              </div>
            </div>

            {/* Model Answer */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
              <h4 className="font-bold text-neutral-200 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-brand-400" /> Model Answer</h4>
              <p className="text-neutral-400 leading-relaxed font-mono whitespace-pre-line">{currentEvaluation.modelAnswer}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={handleNextQuestion}
                className="btn-yellow text-xs px-6 py-3 inline-flex items-center gap-2">
                {currentIdx+1 < session.questions.length ? 'Next Question' : 'View Session Report'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
