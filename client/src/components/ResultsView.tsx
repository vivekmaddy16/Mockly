'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Trophy, Target, CheckCircle2, Sparkles, ArrowRight, RotateCcw, 
  BookOpen, ChevronDown, ChevronUp, BarChart2, AlertCircle, FileText,
  AlertTriangle, Play, Pause, RefreshCw, Volume2, VolumeX, User, Users, GraduationCap,
  Download, Mic, FastForward, Rewind, Info, Radio, Zap
} from 'lucide-react';
import { InterviewSession } from '@/types';
import { computeSentenceHighlights } from '@/lib/gemini';
import { getAudioRecording } from '@/lib/audioStorage';
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

// ─── Production-Grade Real Audio Coaching & Replay Deck ──────────
const RealAudioCoachingDeck: React.FC<{
  session: InterviewSession;
  coachingMoments: any[];
}> = ({ session, coachingMoments }) => {
  const [selectedQIdx, setSelectedQIdx] = useState(0);
  const [audioMode, setAudioMode] = useState<'candidate' | 'ai_coach'>('candidate');
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [hasAudioBlob, setHasAudioBlob] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeMomentId, setActiveMomentId] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentQ = session.questions[selectedQIdx] || session.questions[0];
  const currentEval = currentQ ? session.evaluations[currentQ.id] : undefined;

  // Filter moments specific to this question, or fallback to all session moments
  const relevantMoments = coachingMoments.filter(
    m => m.questionIndex === selectedQIdx || m.questionId === currentQ?.id
  );
  const displayMoments = relevantMoments.length > 0 ? relevantMoments : coachingMoments;

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Load real audio recording from IndexedDB whenever question changes
  useEffect(() => {
    let active = true;
    let urlToRevoke: string | null = null;

    if (!currentQ) return;

    // Reset playback state
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setActiveMomentId(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const loadAudio = async () => {
      setIsLoadingAudio(true);
      try {
        const blob = await getAudioRecording(session.id, currentQ.id);
        if (!active) return;
        if (blob && blob.size > 0) {
          urlToRevoke = URL.createObjectURL(blob);
          setAudioBlobUrl(urlToRevoke);
          setHasAudioBlob(true);
          // Pre-set duration from evaluation metadata if available
          if (currentEval?.audioDurationSec) {
            setDuration(currentEval.audioDurationSec);
          }
        } else {
          setAudioBlobUrl(null);
          setHasAudioBlob(false);
          // If no recorded audio, automatically suggest AI coach debrief mode
          if (currentEval?.inputMode === 'written') {
            setAudioMode('ai_coach');
          }
        }
      } catch (err) {
        console.warn('Failed to retrieve audio recording:', err);
        if (active) {
          setAudioBlobUrl(null);
          setHasAudioBlob(false);
        }
      } finally {
        if (active) setIsLoadingAudio(false);
      }
    };

    loadAudio();

    return () => {
      active = false;
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedQIdx, session.id, currentQ, currentEval]);

  // Sync HTML5 audio playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Dynamic Audio Waveform Canvas Visualizer
  useEffect(() => {
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
      const barCount = 42;
      const barWidth = 3.5;
      const gap = (width - barCount * barWidth) / (barCount - 1);

      phase += 0.08;

      const normalizedProg = duration > 0 ? Math.min(1, currentTime / duration) : 0;
      const currentPassedIndex = Math.floor(normalizedProg * barCount);

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        const isPassed = i <= currentPassedIndex;

        let barH: number;
        if (isPlaying) {
          // Dynamic bouncing frequencies while audio is active
          const noise = Math.sin(i * 0.45 + phase) * Math.cos(i * 0.25 - phase);
          barH = Math.max(6, Math.abs(noise) * (height - 8));
        } else {
          // Static harmonic contour representing vocal timbre
          const harmonic = Math.sin(i * 0.28) * Math.cos(i * 0.16) * 0.6 + 0.4;
          barH = Math.max(5, harmonic * (height - 12));
        }

        const y = (height - barH) / 2;
        ctx.fillStyle = isPassed ? '#E54B54' : '#1B1E16';
        ctx.globalAlpha = isPassed ? 1 : 0.35;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentTime, duration]);

  // Audio Player Controls
  const togglePlayPause = () => {
    if (audioMode === 'candidate') {
      if (!audioRef.current || !audioBlobUrl) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.warn(e));
      }
    } else {
      // AI Coach Voice Mode
      if (isPlaying) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
      } else {
        playAiCoachSpeech();
      }
    }
  };

  const playAiCoachSpeech = (customText?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (audioRef.current) audioRef.current.pause();

    const textToSpeak = customText || (
      currentEval
        ? `Coaching analysis for question ${selectedQIdx + 1}. Overall score: ${currentEval.score} percent. Key feedback: ${currentEval.feedback}. A strong highlight was: ${currentEval.positiveHighlights[0] || 'good structure'}. To improve, consider: ${currentEval.areasToImprove[0] || 'expanding technical depth'}.`
        : `Coaching debrief ready for question ${selectedQIdx + 1}.`
    );

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const seekRelative = (deltaSec: number) => {
    if (audioMode === 'candidate' && audioRef.current) {
      const nextTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + deltaSec));
      audioRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioMode === 'candidate' && audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleMilestoneClick = (moment: any, idx: number) => {
    setActiveMomentId(idx);

    if (audioMode === 'candidate' && audioBlobUrl && audioRef.current) {
      const seekTarget = typeof moment.timeSec === 'number' ? moment.timeSec : 0;
      audioRef.current.currentTime = seekTarget;
      setCurrentTime(seekTarget);
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      // Speak the milestone feedback
      playAiCoachSpeech(`Coaching highlight: ${moment.title}. ${moment.text}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Question Selector Pills */}
      <div className="card-cream p-4 border border-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase text-charcoal/50 tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-coral animate-pulse" /> Multi-Track Vocal Studio
          </span>
          <h3 className="font-display font-black text-sm text-charcoal">Select Interview Question to Inspect</h3>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {session.questions.map((q, idx) => {
            const ev = session.evaluations[q.id];
            const isSelected = selectedQIdx === idx;
            const hasVoice = ev?.hasAudio || ev?.inputMode === 'spoken';

            return (
              <button
                key={q.id}
                onClick={() => setSelectedQIdx(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-charcoal text-cream shadow-md scale-105'
                    : 'bg-white text-charcoal/70 border border-charcoal/10 hover:border-charcoal/30'
                }`}
              >
                {hasVoice ? <Mic className={`w-3 h-3 ${isSelected ? 'text-coral' : 'text-charcoal/50'}`} /> : null}
                <span>Q{idx + 1}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-cream' : 'bg-charcoal/5 text-charcoal/60'
                }`}>
                  {ev ? `${ev.score}%` : 'N/A'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Replay coaching milestones timeline */}
        <div className="lg:col-span-1 card-cream p-6 border border-white shadow-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-black text-base text-charcoal flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-coral" /> Audio Milestones
            </h3>
            <p className="text-[10px] text-charcoal/50 font-bold">
              Jump directly to timestamped voice events & AI feedback points
            </p>
          </div>

          {/* Vertical timeline */}
          <div className="relative pl-6 border-l-2 border-charcoal/10 space-y-4 py-2 max-h-[560px] overflow-y-auto pr-1">
            {displayMoments.map((moment, idx) => {
              const isActive = activeMomentId === idx;
              const isStrength = moment.type === 'strength';
              const isWeakness = moment.type === 'weakness';

              return (
                <div
                  key={idx}
                  onClick={() => handleMilestoneClick(moment, idx)}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    isActive ? 'scale-[1.02]' : 'hover:opacity-85'
                  }`}
                >
                  {/* Circle bullet on line */}
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                    isActive 
                      ? 'border-charcoal bg-charcoal scale-110 shadow'
                      : isStrength
                      ? 'border-emerald-600 bg-emerald-500'
                      : isWeakness
                      ? 'border-coral bg-coral'
                      : 'border-amber-600 bg-amber-500'
                  }`} />

                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    isActive 
                      ? 'bg-charcoal text-cream border-charcoal shadow-md'
                      : 'bg-white text-charcoal border-charcoal/10 hover:border-charcoal/20'
                  }`}>
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className={`px-2 py-0.5 rounded-full font-black uppercase ${
                        isActive 
                          ? 'bg-white/20 text-cream'
                          : isStrength 
                          ? 'bg-emerald-500/10 text-emerald-800' 
                          : isWeakness
                          ? 'bg-coral/10 text-coral'
                          : 'bg-amber-500/10 text-amber-900'
                      }`}>
                        {moment.type.replace('_', ' ')}
                      </span>
                      <span className="font-bold flex items-center gap-1 font-mono">
                        <Zap className="w-3 h-3 text-coral" />
                        {moment.timestamp}
                      </span>
                    </div>
                    <h4 className="text-xs font-black mt-2 leading-tight">{moment.title}</h4>
                    <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed font-medium ${
                      isActive ? 'text-cream/80' : 'text-charcoal/70'
                    }`}>
                      {moment.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Production Audio Deck & Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-cream p-7 sm:p-9 border border-white shadow-2xl space-y-6">
            
            {/* Header / Mode Switcher */}
            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-charcoal/10 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-charcoal/5 border border-charcoal/10 text-[10px] font-extrabold uppercase text-charcoal/60">
                    Question {selectedQIdx + 1} of {session.questions.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-coral/10 text-coral text-[10px] font-extrabold uppercase">
                    {currentQ?.category || 'Technical'}
                  </span>
                </div>
                <h3 className="font-display font-black text-lg text-charcoal">
                  {currentQ?.questionText}
                </h3>
              </div>

              {/* Mode Toggle Switch */}
              <div className="inline-flex items-center gap-1 p-1 bg-white border border-charcoal/10 rounded-full text-xs font-extrabold shadow-sm">
                <button
                  onClick={() => {
                    if (isPlaying) togglePlayPause();
                    setAudioMode('candidate');
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                    audioMode === 'candidate'
                      ? 'bg-charcoal text-cream shadow-sm'
                      : 'text-charcoal/60 hover:text-charcoal'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-coral" /> Candidate Voice
                </button>

                <button
                  onClick={() => {
                    if (isPlaying) togglePlayPause();
                    setAudioMode('ai_coach');
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                    audioMode === 'ai_coach'
                      ? 'bg-charcoal text-cream shadow-sm'
                      : 'text-charcoal/60 hover:text-charcoal'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-lavender-whisper" /> AI Coach Voice
                </button>
              </div>
            </div>

            {/* Hidden HTML5 Audio Element for Candidate Recording */}
            {audioBlobUrl && (
              <audio
                ref={audioRef}
                src={audioBlobUrl}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setDuration(audioRef.current.duration);
                  }
                }}
                onEnded={() => setIsPlaying(false)}
              />
            )}

            {/* Audio Deck Card Display */}
            <div className="bg-charcoal rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-5 border border-charcoal shadow-2xl text-center relative overflow-hidden">
              {/* Background ambient lighting */}
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-coral/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

              {/* Mode indicator status */}
              <div className="flex items-center justify-between w-full text-[10px] font-mono text-cream/60">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-coral animate-ping' : 'bg-cream/40'}`} />
                  {audioMode === 'candidate'
                    ? (hasAudioBlob ? 'STEREO VOCAL RECORDING' : 'KEYBOARD INPUT (NO AUDIO BLOB)')
                    : 'AI NEURAL COACH DEBRIEF'}
                </span>

                <span className="font-bold text-cream/80 uppercase">
                  {playbackSpeed !== 1 ? `${playbackSpeed}x SPEED` : 'NORMAL SPEED'}
                </span>
              </div>

              {/* Real Audio Waveform Canvas */}
              <div className="w-full h-16 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={54}
                  className="w-full max-w-md h-full"
                />
              </div>

              {/* Time Scrubber Slider */}
              <div className="w-full space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeekChange}
                  disabled={audioMode === 'ai_coach' || !hasAudioBlob}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-coral disabled:opacity-40"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-cream/75 font-bold px-1">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration || currentEval?.audioDurationSec || 0)}</span>
                </div>
              </div>

              {/* Playback Controls Deck */}
              <div className="flex items-center justify-center gap-4 flex-wrap pt-1">
                {/* Skip Backward 5s */}
                <button
                  onClick={() => seekRelative(-5)}
                  disabled={audioMode === 'ai_coach' || !hasAudioBlob}
                  className="w-10 h-10 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20 transition cursor-pointer disabled:opacity-30"
                  title="Rewind 5s"
                >
                  <Rewind className="w-4 h-4 text-white" />
                </button>

                {/* Primary Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  disabled={audioMode === 'candidate' && !hasAudioBlob && !isLoadingAudio}
                  className="px-6 py-3 rounded-full bg-coral text-cream font-display font-black text-xs flex items-center gap-2.5 shadow-xl hover:bg-coral/90 active:scale-95 transition cursor-pointer disabled:opacity-40 uppercase tracking-wider"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" /> Pause Replay
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current translate-x-0.5" /> Play {audioMode === 'candidate' ? 'Voice Recording' : 'Coach Debrief'}
                    </>
                  )}
                </button>

                {/* Skip Forward 5s */}
                <button
                  onClick={() => seekRelative(5)}
                  disabled={audioMode === 'ai_coach' || !hasAudioBlob}
                  className="w-10 h-10 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20 transition cursor-pointer disabled:opacity-30"
                  title="Forward 5s"
                >
                  <FastForward className="w-4 h-4 text-white" />
                </button>

                {/* Playback Speed Cycle */}
                <button
                  onClick={() => {
                    const speeds = [1, 1.25, 1.5, 0.75];
                    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    setPlaybackSpeed(speeds[nextIdx]);
                  }}
                  className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-cream font-mono font-bold text-xs transition cursor-pointer"
                  title="Cycle Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Mute Toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-coral" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>

                {/* Download Real Audio File Button */}
                {audioBlobUrl && (
                  <a
                    href={audioBlobUrl}
                    download={`mockly_q${selectedQIdx + 1}_recording.webm`}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition cursor-pointer"
                    title="Download Voice Recording (.webm)"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>

              {/* No Audio Warning Notice */}
              {audioMode === 'candidate' && !hasAudioBlob && !isLoadingAudio && (
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-cream/80 text-xs font-medium max-w-md mx-auto space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-coral text-[11px]">
                    <Info className="w-3.5 h-3.5" /> Voice stream was not recorded for this question
                  </div>
                  <p className="text-[10px] text-cream/70 leading-relaxed">
                    This answer was entered via keyboard input or microphone access was restricted. Switch to <strong>AI Coach Voice</strong> above to hear the spoken debrief.
                  </p>
                </div>
              )}
            </div>

            {/* Candidate Given Response & Interactive Transcript Highlight */}
            {currentEval && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-black text-sm text-charcoal flex items-center gap-2">
                    <FileText className="w-4 h-4 text-coral" /> Candidate Response Transcript
                  </h4>
                  {currentEval.audioDurationSec && (
                    <span className="text-[10px] font-mono font-bold text-charcoal/60 bg-charcoal/5 px-2.5 py-0.5 rounded-full">
                      Duration: {formatSeconds(currentEval.audioDurationSec)}
                    </span>
                  )}
                </div>

                <div className="p-5 rounded-3xl bg-white border border-charcoal/10 space-y-3 shadow-inner">
                  <ExplainableAnswer
                    userAnswer={currentEval.userAnswer}
                    highlights={currentEval.sentenceHighlights}
                    keyPoints={currentQ?.expectedKeyPoints}
                  />
                </div>
              </div>
            )}

            {/* Actionable Feedback Highlights */}
            {currentEval && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-charcoal/10 space-y-1.5">
                  <h5 className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Highlight
                  </h5>
                  <p className="text-charcoal/80 font-medium">
                    {currentEval.positiveHighlights[0] || 'Clear structural organization.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-charcoal/10 space-y-1.5">
                  <h5 className="font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Recommendation
                  </h5>
                  <p className="text-charcoal/80 font-medium">
                    {currentEval.areasToImprove[0] || 'Incorporate explicit technical trade-offs.'}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
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
      <div className="page-shell rounded-[36px] p-6 sm:p-8 text-center space-y-3 shadow-[0_20px_60px_rgba(27,30,22,0.06)]">
        <div className="section-chip mx-auto text-charcoal text-xs font-extrabold">
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
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'scorecard'
                ? 'bg-vast-ink text-lumen-cream font-semibold'
                : 'text-vast-ink hover:bg-lumen-stone/50'
            }`}
          >
            <Trophy className="w-4 h-4" /> Scorecard Report
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'bg-vast-ink text-lumen-cream font-semibold'
                : 'text-vast-ink hover:bg-lumen-stone/50'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Peer Benchmarks
          </button>

          <button
            onClick={() => setActiveTab('coaching_replay')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'coaching_replay'
                ? 'bg-vast-ink text-lumen-cream font-semibold'
                : 'text-vast-ink hover:bg-lumen-stone/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-lavender-whisper" /> Coaching & Replay
          </button>
        </div>
      </div>

      {/* Render tab content dynamically */}
      {activeTab === 'scorecard' && (
        <div className="space-y-8 animate-fade-in">
          {/* Proctoring Verification Alert Box */}
          {session.proctoringFailed && (
            <div className="p-5 rounded-3xl bg-coral/10 border border-coral/25 text-coral text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-pulse-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-coral text-cream flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-charcoal">Proctoring Verification Failed</h4>
                  <p className="text-[10px] text-charcoal/60 mt-0.5">
                    This interview was terminated early due to security infractions under the <strong className="uppercase">{session.proctoringMode}</strong> profile.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coral text-white text-[11px] font-black uppercase tracking-wider self-start sm:self-auto shadow-sm">
                <span>{session.infractions || 0} Infraction(s) Logged</span>
              </div>
            </div>
          )}

          {!session.proctoringFailed && session.proctoringMode && session.proctoringMode !== 'off' && (
            <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 text-xs font-bold flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="font-display font-black text-xs text-charcoal">Proctoring Verification Passed</h5>
                  <p className="text-[10px] text-charcoal/50">
                    The candidate successfully completed the interview matching the <strong className="uppercase">{session.proctoringMode}</strong> security checks.
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-extrabold text-emerald-600 bg-white border border-emerald-300 px-3 py-1 rounded-full">
                {session.infractions || 0} Infractions
              </div>
            </div>
          )}

          {session.proctoringMode === 'off' && (
            <div className="p-4 rounded-3xl bg-black/5 border border-black/10 text-charcoal/80 text-xs font-bold flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-charcoal/10 text-charcoal flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-charcoal/60" />
                </div>
                <div>
                  <h5 className="font-display font-black text-xs text-charcoal">Practice Mode (No Proctoring)</h5>
                  <p className="text-[10px] text-charcoal/50">
                    Proctoring controls and distraction monitoring were deactivated for this prep session.
                  </p>
                </div>
              </div>
            </div>
          )}

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
                    <span className="block text-[9px] font-extrabold uppercase text-charcoal/50">Camera Engagement</span>
                    <span className="font-display font-black text-lg text-coral">{typeof session.overallConfidence === 'number' && session.overallConfidence > 0 ? `${session.overallConfidence}%` : 'N/A'}</span>
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
                        {ev.confidenceMetrics && (
                          <div className="p-4 rounded-2xl bg-white border border-charcoal/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-charcoal/60 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-coral" /> Candidate Telemetry & Emotion
                              </span>
                              {typeof ev.confidenceScore === 'number' && (
                                <span className="text-[10px] font-bold text-coral">
                                  {ev.confidenceScore}% Confidence Index
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                              <div className="p-2.5 bg-cream rounded-2xl border border-charcoal/5">
                                <span className="text-[10px] text-charcoal/50 block font-bold">EYE CONTACT</span>
                                <span className="font-black text-xs text-charcoal">{ev.confidenceMetrics.eyeContact}%</span>
                              </div>
                              <div className="p-2.5 bg-cream rounded-2xl border border-charcoal/5">
                                <span className="text-[10px] text-charcoal/50 block font-bold">STABILITY</span>
                                <span className="font-black text-xs text-charcoal">{ev.confidenceMetrics.stability}%</span>
                              </div>
                              <div className="p-2.5 bg-cream rounded-2xl border border-charcoal/5">
                                <span className="text-[10px] text-charcoal/50 block font-bold">PACING</span>
                                <span className="font-black text-xs text-charcoal">{ev.confidenceMetrics.pacing > 0 ? `${ev.confidenceMetrics.pacing} WPM` : 'Not measured'}</span>
                              </div>
                              <div className="p-2.5 bg-cream rounded-2xl border border-charcoal/5">
                                <span className="text-[10px] text-charcoal/50 block font-bold">DOMINANT EMOTION</span>
                                <span className="font-black text-xs text-emerald-700 capitalize">{ev.confidenceMetrics.emotion || 'Neutral'}</span>
                              </div>
                            </div>
                          </div>
                        )}

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
        <RealAudioCoachingDeck session={session} coachingMoments={coachingMoments} />
      )}
    </div>
  );
};
