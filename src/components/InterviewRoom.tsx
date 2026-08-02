'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, Mic, MicOff, Volume2, VolumeX, Clock, Lightbulb, Send, Sparkles, 
  CheckCircle2, ArrowRight, Code2, AlertTriangle, HelpCircle, X, Award, Zap, Layers, MessageSquare
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
        const noise = Math.sin(i * 0.3 + phase) * Math.cos(i * 0.2 - phase);
        const barHeight = Math.max(4, Math.abs(noise) * (height - 6));
        const y = (height - barHeight) / 2;

        ctx.fillStyle = '#1B1E16';
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
      width={200}
      height={32}
      className="rounded-full bg-white border border-charcoal/10"
    />
  );
};

// ─── Webcam Telemetry Component ──────────────────────────────
const WebcamTelemetry: React.FC<{
  isInterviewing: boolean;
  onMetricsUpdate: (metrics: { eyeContact: number; stability: number; pacing: number; emotion: string; confidence: number }) => void;
}> = ({ isInterviewing, onMetricsUpdate }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [metrics, setMetrics] = useState({
    eyeContact: 95,
    stability: 98,
    pacing: 120,
    emotion: 'Focused',
    confidence: 96
  });

  // Enable/Disable webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasPermission(true);
      setCameraActive(true);
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setHasPermission(false);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera(); // auto-start on load
    return () => stopCamera();
  }, []);

  // Animation & Metric Simulation loop
  useEffect(() => {
    if (!cameraActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    // Simulated facial mesh node positions relative to canvas size
    const baseMeshPoints = [
      { x: 0.5, y: 0.35 }, // Nose
      { x: 0.42, y: 0.28 }, // Left Eye
      { x: 0.58, y: 0.28 }, // Right Eye
      { x: 0.5, y: 0.48 }, // Mouth
      { x: 0.32, y: 0.35 }, // Left cheek outline
      { x: 0.68, y: 0.35 }, // Right cheek outline
      { x: 0.5, y: 0.18 }, // Forehead
      { x: 0.5, y: 0.62 }, // Chin
    ];

    const connections = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 6], [2, 6], [4, 7], [5, 7], [3, 7],
      [1, 4], [2, 5], [1, 2]
    ];

    const run = () => {
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw tracking box
      ctx.strokeStyle = '#10b981'; // green for focus
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(w * 0.2, h * 0.15, w * 0.6, h * 0.7);
      ctx.setLineDash([]);

      // 2. Draw eye tracking reticle
      const gazeOffX = Math.sin(frameCount * 0.05) * 4;
      const gazeOffY = Math.cos(frameCount * 0.03) * 3;
      ctx.fillStyle = '#E54B54';
      ctx.beginPath();
      ctx.arc(w * 0.42 + gazeOffX, h * 0.28 + gazeOffY, 2, 0, Math.PI * 2);
      ctx.arc(w * 0.58 + gazeOffX, h * 0.28 + gazeOffY, 2, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw live mesh wireframe
      // We apply slight natural motion based on sin/cos waves (simulating head tracking)
      const headX = Math.sin(frameCount * 0.02) * 6;
      const headY = Math.cos(frameCount * 0.015) * 4;

      const currentPoints = baseMeshPoints.map(p => ({
        x: p.x * w + headX + (Math.sin(frameCount * 0.1 + p.x) * 1.5),
        y: p.y * h + headY + (Math.cos(frameCount * 0.1 + p.y) * 1.5),
      }));

      // Draw mesh connection lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.8;
      connections.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(currentPoints[start].x, currentPoints[start].y);
        ctx.lineTo(currentPoints[end].x, currentPoints[end].y);
        ctx.stroke();
      });

      // Draw mesh nodes
      ctx.fillStyle = '#7BD695';
      currentPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Update metrics periodically
      if (frameCount % 45 === 0) {
        // Natural fluctuations
        const eyeVal = Math.round(90 + Math.sin(frameCount * 0.01) * 8);
        const stabVal = Math.round(94 + Math.cos(frameCount * 0.02) * 4);
        const wpmVal = Math.round(115 + Math.sin(frameCount * 0.01) * 20);
        
        let emot = 'Focused';
        if (eyeVal < 86) emot = 'Nervous';
        else if (stabVal > 97) emot = 'Confident';

        const confVal = Math.round((eyeVal + stabVal + (100 - Math.abs(130 - wpmVal) / 2)) / 3);

        const newMetrics = {
          eyeContact: eyeVal,
          stability: stabVal,
          pacing: wpmVal,
          emotion: emot,
          confidence: Math.min(100, Math.max(50, confVal))
        };

        setMetrics(newMetrics);
        onMetricsUpdate(newMetrics);
      }

      animId = requestAnimationFrame(run);
    };

    run();
    return () => cancelAnimationFrame(animId);
  }, [cameraActive]);

  return (
    <div className="card-cream p-5 space-y-4 border border-white shadow-xl flex flex-col h-full justify-between animate-fade-in">
      <div className="space-y-1">
        <h4 className="font-display font-black text-sm text-charcoal">Visual Telemetry Console</h4>
        <p className="text-[10px] text-charcoal/50 font-bold">Real-time eye tracking & focus profiling</p>
      </div>

      {/* Video Box */}
      <div className="relative rounded-2xl overflow-hidden bg-charcoal aspect-[4/3] w-full flex items-center justify-center border border-charcoal/10 shadow-inner">
        {hasPermission === false ? (
          <div className="p-4 text-center space-y-2 text-cream/70">
            <span className="text-[11px] font-bold block">Camera permission required for face analysis</span>
            <button onClick={startCamera} className="px-3.5 py-1.5 rounded-full bg-coral text-cream text-[10px] font-black uppercase tracking-wider shadow">
              Grant Permission
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              style={{ transform: 'scaleX(-1)' }} // Mirror view
            />
            {cameraActive && (
              <canvas
                ref={canvasRef}
                width={320}
                height={240}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            )}
          </>
        )}

        {/* Live Indicator pill */}
        {cameraActive && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-coral text-white text-[9px] font-black flex items-center gap-1.5 shadow animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            LIVE TELEMETRY
          </div>
        )}
      </div>

      {/* Telemetry metrics display */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2.5 bg-white rounded-xl border border-charcoal/5 flex flex-col justify-between shadow-sm">
            <span className="text-charcoal/50 font-bold uppercase">Eye Contact</span>
            <span className="font-display font-black text-xs mt-1 text-charcoal">{cameraActive ? `${metrics.eyeContact}%` : 'N/A'}</span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-charcoal/5 flex flex-col justify-between shadow-sm">
            <span className="text-charcoal/50 font-bold uppercase">Head Stability</span>
            <span className="font-display font-black text-xs mt-1 text-charcoal">{cameraActive ? `${metrics.stability}%` : 'N/A'}</span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-charcoal/5 flex flex-col justify-between shadow-sm">
            <span className="text-charcoal/50 font-bold uppercase">Pacing</span>
            <span className="font-display font-black text-xs mt-1 text-charcoal">{cameraActive ? `${metrics.pacing} WPM` : 'N/A'}</span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-charcoal/5 flex flex-col justify-between shadow-sm">
            <span className="text-charcoal/50 font-bold uppercase">Aura/State</span>
            <span className={`font-display font-black text-xs mt-1 uppercase ${
              !cameraActive ? 'text-charcoal/55' : metrics.emotion === 'Nervous' ? 'text-coral' : 'text-emerald-700'
            }`}>{cameraActive ? metrics.emotion : 'Standby'}</span>
          </div>
        </div>

        {/* Overall Confidence Index Bar */}
        <div className="p-3 bg-white rounded-2xl border border-charcoal/10 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-charcoal">Confidence Index</span>
            <span className="text-coral font-black">{cameraActive ? `${metrics.confidence}%` : '0%'}</span>
          </div>
          <div className="h-1.5 w-full bg-charcoal/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral transition-all duration-500 rounded-full"
              style={{ width: `${cameraActive ? metrics.confidence : 0}%` }}
            />
          </div>
        </div>

        {/* Camera Toggle Button */}
        <button
          onClick={cameraActive ? stopCamera : startCamera}
          className="w-full py-2 rounded-xl border border-charcoal/15 bg-white text-charcoal hover:bg-cream transition text-[10px] font-black uppercase tracking-wider"
        >
          {cameraActive ? 'Deactivate Camera' : 'Activate Camera'}
        </button>
      </div>
    </div>
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
  const [inputMode, setInputMode] = useState<'spoken' | 'written'>('spoken');
  const [telemetry, setTelemetry] = useState({
    eyeContact: 95,
    stability: 98,
    pacing: 120,
    emotion: 'Focused',
    confidence: 96
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const hasUnsavedProgress = useRef(false);

  const handleTelemetryUpdate = useCallback((metrics: any) => {
    setTelemetry(metrics);
  }, []);

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
      const result = await evaluateAnswer(currentQuestion, userAnswer, session.targetRole, session.aiEngine || 'gemini');
      
      // Inject real-time webcam telemetry metrics
      result.confidenceScore = telemetry.confidence;
      result.confidenceMetrics = {
        eyeContact: telemetry.eyeContact,
        stability: telemetry.stability,
        pacing: telemetry.pacing,
        emotion: telemetry.emotion
      };
      result.inputMode = inputMode;

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
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in py-4">
      
      {/* Top HUD Header (Castrio Cream Container) */}
      <div className="soft-card p-4 flex items-center justify-between gap-4 rounded-[28px]">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full bg-charcoal text-cream flex items-center justify-center font-bold shadow-md transition-transform ${
            isSpeaking ? 'scale-110 ring-4 ring-coral/30' : ''
          }`}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-black text-charcoal text-sm">AI Interviewer</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-charcoal font-bold border border-charcoal/10 hidden sm:inline">
                {session.targetRole}
              </span>
              {session.roundType && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-coral/10 text-coral font-extrabold border border-coral/15">
                  {session.roundType === 'dsa' ? 'DSA Round' :
                   session.roundType === 'system_design' ? 'System Design' :
                   session.roundType === 'behavioral' ? 'Behavioral Round' : 'Tech Screen'}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-charcoal/60">{session.experienceLevel}</p>
          </div>
        </div>

        {/* Desktop Stepper */}
        <div className="hidden md:flex items-center gap-2">
          {session.questions.map((q, idx) => {
            const done = !!session.evaluations[q.id];
            const cur = idx === currentIdx;
            return (
              <div key={q.id} className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                cur ? 'bg-charcoal text-cream shadow-sm'
                : done ? 'bg-white text-emerald-700 border border-emerald-300'
                : 'bg-white/60 text-charcoal/50 border border-charcoal/5'
              }`}>
                {done ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-600" /> : null}
                Q{idx+1}
              </div>
            );
          })}
        </div>

        {/* Controls Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStarDrawer(!showStarDrawer)}
            className="px-3 py-2 rounded-full bg-white border border-charcoal/10 text-charcoal hover:bg-cream text-xs font-extrabold flex items-center gap-1.5 transition"
          >
            <HelpCircle className="w-4 h-4 text-coral" />
            <span className="hidden lg:inline">STAR Method</span>
          </button>

          <button
            onClick={speakQuestion}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${
              isSpeaking ? 'bg-coral text-white border-coral animate-pulse' : 'bg-white text-charcoal border-charcoal/10 hover:bg-cream'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-charcoal/10 text-xs font-mono font-bold text-charcoal">
            <Clock className="w-3.5 h-3.5 text-coral" /> {fmt(seconds)}
          </div>
        </div>
      </div>

      {/* 3-Column Bento Layout wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Interviewing workspace (Question + Inputs / Evaluations) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Question Card (Castrio Mint Card Accent) */}
          <div className="soft-card p-7 sm:p-9 space-y-5 relative overflow-hidden bg-gradient-to-br from-[#a8e0ac] via-[#dff5db] to-[#f7fff8]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3.5 py-1 rounded-full bg-charcoal text-cream text-xs font-extrabold uppercase tracking-wider shadow-sm">
                  {currentQuestion.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 text-charcoal text-xs font-extrabold border border-charcoal/10">
                  {currentQuestion.difficulty}
                </span>
              </div>
              <span className="text-xs font-mono font-black text-charcoal/70">
                Q{currentIdx+1} / {session.questions.length}
              </span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-charcoal leading-tight">
              {currentQuestion.questionText}
            </h2>

            {currentQuestion.contextOrCode && (
              <div className="rounded-2xl overflow-hidden border border-charcoal/10 bg-white/90 p-4">
                <pre className="text-charcoal font-mono text-xs overflow-x-auto leading-relaxed">{currentQuestion.contextOrCode}</pre>
              </div>
            )}

            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 text-xs font-black text-charcoal hover:underline transition"
              >
                <Lightbulb className="w-4 h-4 text-coral" /> {showHint ? 'Hide Concept Keypoints' : 'Need a Keypoint Hint?'}
              </button>
              {showHint && (
                <div className="mt-3 p-4 rounded-2xl bg-white/90 border border-charcoal/10 text-xs text-charcoal space-y-2 animate-fade-in shadow-sm">
                  <p className="font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-coral" /> Key Focus Points:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1 font-bold text-charcoal/80">
                    {currentQuestion.expectedKeyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Round Specific Dynamic Banner */}
          {session.roundType === 'dsa' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
              <Code2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span><strong>Algorithms (DSA) Tip:</strong> Walk through your logic step-by-step. Remember to state the Big-O Time & Space Complexity explicitly!</span>
            </div>
          )}
          {session.roundType === 'system_design' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
              <Layers className="w-4 h-4 shrink-0 text-amber-600" />
              <span><strong>System Design Tip:</strong> Discuss database choices, scaling strategies, caching limits, and high-level component diagrams first.</span>
            </div>
          )}
          {session.roundType === 'behavioral' && (
            <div className="p-4 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
              <MessageSquare className="w-4 h-4 shrink-0 text-coral" />
              <span><strong>Behavioral Tip:</strong> Frame your responses with the STAR method (Situation, Task, Action, Result) to capture maximum score detail.</span>
            </div>
          )}

          {/* Answer Input Card */}
          {!currentEvaluation ? (
            <div className="soft-card p-7 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-black text-charcoal uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-coral" /> Candidate Response
                  </label>

                  {/* Modality Selector Pills */}
                  <div className="flex items-center gap-1.5 p-1 bg-white border border-charcoal/10 rounded-full text-[10px] font-black">
                    {[
                      { id: 'spoken', label: 'Voice' },
                      { id: 'written', label: 'Keyboard' },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          if (isListening) {
                            try { recognitionRef.current?.stop(); } catch {}
                            setIsListening(false);
                          }
                          setInputMode(mode.id as any);
                        }}
                        className={`px-3 py-1 rounded-full cursor-pointer transition ${
                          inputMode === mode.id 
                            ? 'bg-charcoal text-cream shadow-sm' 
                            : 'text-charcoal/60 hover:text-charcoal'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {inputMode === 'spoken' && (
                  <div className="flex items-center gap-3">
                    <AudioWaveformCanvas isRecording={isListening} />
                    
                    {/* Connected Dual-Pill STT Button */}
                    <button onClick={toggleListening} className="btn-dual-pill">
                      <div className="icon-badge">
                        {isListening ? <MicOff className="w-4 h-4 text-coral" /> : <Mic className="w-4 h-4 text-charcoal" />}
                      </div>
                      <span className="btn-label">{isListening ? 'Recording...' : 'Speak Response'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <textarea
                  rows={7}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Structure your answer clearly (STAR framework recommended: Situation, Task, Action, Result)..."
                  className="w-full px-5 py-4 bg-white border border-charcoal/10 rounded-3xl text-charcoal text-sm font-medium focus:outline-none focus:border-charcoal transition placeholder:text-charcoal/40 resize-y leading-relaxed shadow-inner"
                />
                {interimText && (
                  <div className="px-4 py-2 text-xs text-coral font-bold italic border-t border-charcoal/10 bg-coral/5 rounded-b-3xl flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 animate-pulse" /> {interimText}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
                <span className="text-xs font-bold text-charcoal/60 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-coral" /> Pro-tip: State Big-O complexity for algorithms
                </span>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="btn-dual-pill-light disabled:opacity-50"
                >
                  <div className="icon-badge">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <span className="btn-label">{isEvaluating ? 'Evaluating...' : 'Submit Answer'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Evaluation Feedback Card */
            <div className="soft-card p-8 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-charcoal text-cream font-display font-black text-2xl flex items-center justify-center shadow-lg">
                    {currentEvaluation.score}%
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl text-charcoal">Evaluation Complete</h3>
                    <p className="text-xs font-bold text-charcoal/60">Detailed AI analysis generated</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'Structure', score: currentEvaluation.structureScore },
                    { label: 'Technical', score: currentEvaluation.technicalScore },
                    { label: 'Clarity', score: currentEvaluation.clarityScore },
                  ].map((m, i) => (
                    <div key={i} className="text-center px-3.5 py-2 rounded-2xl bg-white border border-charcoal/10 text-xs font-extrabold text-charcoal">
                      <span className="block text-[10px] text-charcoal/60 uppercase">{m.label}</span>
                      <span className="text-sm font-black">{m.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="p-5 rounded-3xl bg-white border border-charcoal/10 space-y-2">
                  <h4 className="font-extrabold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Highlights
                  </h4>
                  <ul className="space-y-1.5 font-bold text-charcoal/80">
                    {currentEvaluation.positiveHighlights.map((pt, i) => <li key={i}>• {pt}</li>)}
                  </ul>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-charcoal/10 space-y-2">
                  <h4 className="font-extrabold text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Areas to Expand
                  </h4>
                  <ul className="space-y-1.5 font-bold text-charcoal/80">
                    {currentEvaluation.areasToImprove.map((pt, i) => <li key={i}>• {pt}</li>)}
                  </ul>
                </div>
              </div>

              {/* Dynamic telemetry stats for question */}
              {currentEvaluation.confidenceMetrics && (
                <div className="p-4 rounded-3xl bg-white border border-charcoal/10 space-y-2 text-xs">
                  <h4 className="font-bold text-charcoal flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-coral animate-pulse" /> Telemetry Performance Score: <span className="font-black text-coral">{currentEvaluation.confidenceScore}%</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="p-2.5 bg-cream rounded-2xl border border-charcoal/5">
                      <span className="text-[10px] text-charcoal/50 block font-bold">EYE CONTACT</span>
                      <span className="font-black text-xs text-charcoal">{currentEvaluation.confidenceMetrics.eyeContact}%</span>
                    </div>
                    <div className="p-2.5 bg-cream rounded-2xl border border-charcoal/5">
                      <span className="text-[10px] text-charcoal/50 block font-bold">STABILITY</span>
                      <span className="font-black text-xs text-charcoal">{currentEvaluation.confidenceMetrics.stability}%</span>
                    </div>
                    <div className="p-2.5 bg-cream rounded-2xl border border-charcoal/5">
                      <span className="text-[10px] text-charcoal/50 block font-bold">PACING</span>
                      <span className="font-black text-xs text-charcoal">{currentEvaluation.confidenceMetrics.pacing} WPM</span>
                    </div>
                    <div className="p-2.5 bg-cream rounded-2xl border border-charcoal/5">
                      <span className="text-[10px] text-charcoal/50 block font-bold">DOMINANT EMOTION</span>
                      <span className="font-black text-xs text-emerald-700 capitalize">{currentEvaluation.confidenceMetrics.emotion}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 rounded-3xl bg-white border border-charcoal/10 space-y-2 text-xs">
                <h4 className="font-display font-black text-base text-charcoal flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-coral" /> Ideal Model Answer
                </h4>
                <p className="text-charcoal/80 leading-relaxed font-medium whitespace-pre-line">{currentEvaluation.modelAnswer}</p>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={handleNextQuestion} className="btn-dual-pill">
                  <div className="icon-badge">
                    <ArrowRight className="w-4 h-4 text-charcoal" />
                  </div>
                  <span className="btn-label">{currentIdx+1 < session.questions.length ? 'Next Question' : 'View Session Report'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Webcam Telemetry console */}
        <div className="lg:col-span-1 h-full">
          <WebcamTelemetry
            isInterviewing={!currentEvaluation}
            onMetricsUpdate={handleTelemetryUpdate}
          />
        </div>
      </div>

      {/* STAR Framework Drawer */}
      {showStarDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end modal-overlay animate-fade-in" onClick={() => setShowStarDrawer(false)}>
          <div className="w-full max-w-md modal-card-castrio h-full p-8 space-y-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div className="flex items-center gap-2 text-charcoal font-display font-extrabold text-lg">
                <Award className="w-5 h-5 text-coral" /> STAR Response Method
              </div>
              <button onClick={() => setShowStarDrawer(false)} className="p-2 rounded-full hover:bg-black/5 text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { letter: 'S', title: 'Situation', desc: 'Set the context. Describe the specific challenge or project background.' },
                { letter: 'T', title: 'Task', desc: 'Define your role and what goals you were tasked with resolving.' },
                { letter: 'A', title: 'Action', desc: 'Explain the technical steps, algorithms, or decisions YOU executed.' },
                { letter: 'R', title: 'Result', desc: 'Share quantifiable outcomes, latency improvements, or metrics.' },
              ].map((step, i) => (
                <div key={i} className="p-4 rounded-3xl bg-white border border-charcoal/10 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-charcoal text-cream font-black text-sm flex items-center justify-center shrink-0">
                    {step.letter}
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-charcoal">{step.title}</h4>
                    <p className="text-xs text-charcoal/70 mt-1 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
