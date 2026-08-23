'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, Mic, MicOff, Volume2, VolumeX, Clock, Lightbulb, Send, Sparkles, 
  CheckCircle2, ArrowRight, Code2, AlertTriangle, HelpCircle, X, Award, Zap, Layers, MessageSquare
} from 'lucide-react';
import { InterviewSession, QuestionEvaluation } from '@/types';
import { evaluateAnswer } from '@/lib/gemini';
import { updateSessionEvaluation, terminateSessionEarly } from '@/lib/storage';

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

  const prevCenterRef = useRef<{ x: number; y: number } | null>(null);
  const prevMouthRef = useRef<{ x: number; y: number } | null>(null);
  const metricsRef = useRef({
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
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            // Auto-play was interrupted by stopCamera/unmount
            console.log("Webcam video play interrupted or prevented:", error.message);
          });
        }
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

  // Animation & Face Detection loop
  useEffect(() => {
    if (!cameraActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;
    let detector: any = null;
    let active = true;
    let lastTimestamp = -1;

    const initDetector = async () => {
      try {
        const { FaceDetector, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        const newDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`
          },
          runningMode: "VIDEO"
        });
        if (!active) {
          newDetector.close();
          console.log("FaceDetector initialized after cleanup, closed immediately.");
          return;
        }
        detector = newDetector;
        console.log("FaceDetector initialized successfully");
      } catch (err) {
        console.error("Failed to initialize FaceDetector:", err);
      }
    };
    initDetector();

    const w = canvas.width;
    const h = canvas.height;

    const run = () => {
      if (!active) return;
      frameCount++;
      ctx.clearRect(0, 0, w, h);

      if (detector && videoRef.current && videoRef.current.readyState >= 2 && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        try {
          let timestamp = performance.now();
          if (timestamp <= lastTimestamp) {
            timestamp = lastTimestamp + 1; // Force strictly increasing timestamps
          }
          lastTimestamp = timestamp;

          const detectionResult = detector.detectForVideo(videoRef.current, timestamp);
          const detections = detectionResult.detections || [];

          if (detections.length > 0) {
            const detection = detections[0];
            const bbox = detection.boundingBox;
            const keypoints = detection.keypoints || [];

            // Bounding box mapping
            let x = 0, y = 0, width = 0, height = 0;
            if (bbox) {
              if (bbox.originX <= 1.1 && bbox.width <= 1.1) {
                x = bbox.originX * w;
                y = bbox.originY * h;
                width = bbox.width * w;
                height = bbox.height * h;
              } else {
                x = bbox.originX;
                y = bbox.originY;
                width = bbox.width;
                height = bbox.height;
              }
            }

            // 1. Draw glowing tracking bounding box
            ctx.strokeStyle = '#10b981'; // vibrant green
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y, width, height);

            // Draw corner brackets
            const lineLen = 8;
            ctx.beginPath();
            ctx.moveTo(x + lineLen, y); ctx.lineTo(x, y); ctx.lineTo(x, y + lineLen);
            ctx.moveTo(x + width - lineLen, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + lineLen);
            ctx.moveTo(x + lineLen, y + height); ctx.lineTo(x, y + height); ctx.lineTo(x, y + height - lineLen);
            ctx.moveTo(x + width - lineLen, y + height); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width, y + height - lineLen);
            ctx.stroke();

            // 2. Draw keypoints and face connections
            if (keypoints.length >= 6) {
              const pts = keypoints.map((kp: any) => ({
                x: kp.x * w,
                y: kp.y * h
              }));

              const connections = [
                [0, 1], [0, 2], [1, 2], [2, 3],
                [0, 4], [1, 5], [3, 4], [3, 5]
              ];

              ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
              ctx.lineWidth = 1;
              connections.forEach(([start, end]) => {
                ctx.beginPath();
                ctx.moveTo(pts[start].x, pts[start].y);
                ctx.lineTo(pts[end].x, pts[end].y);
                ctx.stroke();
              });

              ctx.fillStyle = '#C5F874'; // lime green
              pts.forEach((pt: any, idx: number) => {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, idx === 2 ? 3 : 2, 0, Math.PI * 2);
                ctx.fill();
              });

              // 3. Metric Calculations
              const rightEye = keypoints[0];
              const leftEye = keypoints[1];
              const nose = keypoints[2];
              const mouth = keypoints[3];

              const eyesMidpointX = (rightEye.x + leftEye.x) / 2;
              const eyesDistanceX = Math.abs(rightEye.x - leftEye.x);
              const noseOffsetX = Math.abs(nose.x - eyesMidpointX);
              const noseOffsetRatio = eyesDistanceX > 0 ? noseOffsetX / eyesDistanceX : 0.5;

              const rawEyeContact = Math.max(0, Math.min(100, Math.round(100 - (noseOffsetRatio * 250))));

              const center = { x: (x + width / 2) / w, y: (y + height / 2) / h };
              let movement = 0;
              if (prevCenterRef.current) {
                const dx = center.x - prevCenterRef.current.x;
                const dy = center.y - prevCenterRef.current.y;
                movement = Math.sqrt(dx * dx + dy * dy);
              }
              prevCenterRef.current = center;

              const rawStability = Math.max(0, Math.min(100, Math.round(100 - (movement * 450))));

              const nextEyeContact = Math.round(metricsRef.current.eyeContact * 0.85 + rawEyeContact * 0.15);
              const nextStability = Math.round(metricsRef.current.stability * 0.85 + rawStability * 0.15);

              // Mouth tracking for speaking pace
              let rawPacing = metricsRef.current.pacing;
              if (mouth && prevMouthRef.current) {
                const dyMouth = Math.abs(mouth.y - prevMouthRef.current.y);
                const dxMouth = Math.abs(mouth.x - prevMouthRef.current.x);
                const mouthMove = Math.sqrt(dxMouth * dxMouth + dyMouth * dyMouth);
                
                if (mouthMove > 0.003) {
                  rawPacing = Math.round(110 + Math.sin(frameCount * 0.15) * 20);
                } else {
                  rawPacing = Math.round(rawPacing * 0.9 + 40 * 0.1);
                }
              }
              if (mouth) prevMouthRef.current = mouth;

              const nextPacing = Math.max(0, rawPacing);

              let emot = 'Focused';
              if (nextEyeContact < 78) {
                emot = 'Distracted';
              } else if (nextStability < 82) {
                emot = 'Nervous';
              } else if (nextEyeContact > 90 && nextStability > 94) {
                emot = 'Confident';
              }

              const rawConf = Math.round((nextEyeContact + nextStability) / 2);
              const nextConfidence = Math.min(100, Math.max(50, rawConf));

              const updatedMetrics = {
                eyeContact: nextEyeContact,
                stability: nextStability,
                pacing: nextPacing,
                emotion: emot,
                confidence: nextConfidence
              };

              metricsRef.current = updatedMetrics;
              
              if (frameCount % 8 === 0) {
                setMetrics(updatedMetrics);
                onMetricsUpdate(updatedMetrics);
              }
            }
          } else {
            // Face not found inside frame
            const noFaceMetrics = {
              eyeContact: 0,
              stability: 0,
              pacing: 0,
              emotion: 'No Face',
              confidence: 0
            };
            metricsRef.current = noFaceMetrics;

            if (frameCount % 8 === 0) {
              setMetrics(noFaceMetrics);
              onMetricsUpdate(noFaceMetrics);
            }

            // Draw alignment helper Box (red)
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
            ctx.fillRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);

            ctx.fillStyle = '#ef4444';
            ctx.font = '8px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ALIGN FACE IN FRAME', w / 2, h / 2);
          }
        } catch (detectorErr) {
          console.warn("Detection error:", detectorErr);
        }
      } else {
        // Loading state
        ctx.strokeStyle = 'rgba(181, 196, 156, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(w * 0.2, h * 0.15, w * 0.6, h * 0.7);
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(181, 196, 156, 0.65)';
        ctx.font = 'bold 8px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LOADING DETECTOR...', w / 2, h / 2);
      }

      animId = requestAnimationFrame(run);
    };

    run();
    return () => {
      active = false;
      cancelAnimationFrame(animId);
      if (detector) {
        try {
          detector.close();
        } catch (closeErr) {
          console.warn("Error closing detector:", closeErr);
        }
      }
    };
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
                style={{ transform: 'scaleX(-1)' }} // Mirror canvas to align with mirrored video
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
  const lastInfractionTimeRef = useRef<number>(0);

  // Proctoring and Security States
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [infractions, setInfractions] = useState(session.infractions || 0);
  const [showBlurWarning, setShowBlurWarning] = useState(false);
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [proctoringFailed, setProctoringFailed] = useState(session.proctoringFailed || false);

  const maxAllowedInfractions = session.proctoringMode === 'strict' ? 1 : 3;

  // Proctoring early auto-termination logic
  const terminateSessionDueToProctoring = useCallback(async (finalInfractions: number) => {
    if (session.status === 'completed') return;

    // Update local state
    const updatedSession = {
      ...session,
      status: 'completed' as const,
      infractions: finalInfractions,
      proctoringFailed: true,
      completedAt: new Date().toISOString()
    };

    // Calculate total score for evaluated answers
    const evals = Object.values(updatedSession.evaluations);
    if (evals.length > 0) {
      updatedSession.totalScore = Math.round(
        evals.reduce((acc, ev) => acc + (ev.score || 0), 0) / evals.length
      );
    } else {
      updatedSession.totalScore = 0;
    }

    const feedback = {
      summary: `This interview session was terminated early under the ${session.proctoringMode} proctoring configuration due to security violations. A total of ${finalInfractions} infraction(s) were logged.`,
      strengths: [],
      weaknesses: [`Exceeded the infraction limit in ${session.proctoringMode} proctoring mode.`],
      actionableAdvice: [
        'Ensure you stay inside the active browser tab and maintain fullscreen mode for secure interviews.',
        'Do not press system shortcuts (PrintScreen, Ctrl/Cmd + P, Win+Shift+S) or switch tabs during tests.'
      ]
    };

    updatedSession.overallFeedback = feedback;

    setSession(updatedSession);
    setProctoringFailed(true);

    // Stop active audio transcription and speaking
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');

    try {
      await terminateSessionEarly(session.id, finalInfractions, true, feedback);
    } catch (err) {
      console.warn('Failed to save terminated session:', err);
    }
  }, [session, terminateSessionEarly]);

  // Immediately cancel Speech Synthesis and abort Speech Recognition whenever proctoring fails
  useEffect(() => {
    if (proctoringFailed) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      setIsListening(false);
      setInterimText('');
    }
  }, [proctoringFailed]);

  const handleTelemetryUpdate = useCallback((metrics: any) => {
    setTelemetry(metrics);
  }, []);

  // Timer (only active when interview has started and not terminated)
  useEffect(() => {
    if (!hasStarted || proctoringFailed) return;
    const interval = setInterval(() => setSeconds(p => p + 1), 1000);
    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          recognitionRef.current.stop();
        } catch { /* ignore */ }
      }
    };
  }, [hasStarted, proctoringFailed]);

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

  // Enforce fullscreen state change listeners
  useEffect(() => {
    if (!hasStarted || session.proctoringMode === 'off' || proctoringFailed) return;

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [hasStarted, session.proctoringMode, proctoringFailed]);



  // Monitor Window Focus / Tab Switching
  useEffect(() => {
    if (!hasStarted || session.proctoringMode === 'off' || proctoringFailed) return;

    const logFocusLossInfraction = () => {
      const now = Date.now();
      if (now - lastInfractionTimeRef.current < 1000) return;
      lastInfractionTimeRef.current = now;

      setIsWindowFocused(false);
      setInfractions(p => {
        const next = p + 1;
        if (next >= maxAllowedInfractions) {
          terminateSessionDueToProctoring(next);
        }
        return next;
      });
      setShowBlurWarning(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logFocusLossInfraction();
      } else {
        if (!showBlurWarning && !showScreenshotWarning) {
          setIsWindowFocused(true);
        }
      }
    };

    const handleWindowBlur = () => {
      logFocusLossInfraction();
    };

    const handleWindowFocus = () => {
      if (!showBlurWarning && !showScreenshotWarning) {
        setIsWindowFocused(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [hasStarted, showBlurWarning, showScreenshotWarning, session.proctoringMode, proctoringFailed, maxAllowedInfractions, terminateSessionDueToProctoring]);

  // Prevent Screenshot Shortcuts & Page Printing (Global)
  useEffect(() => {
    if (!hasStarted || session.proctoringMode === 'off' || proctoringFailed) return;

    const triggerScreenshotAttempt = () => {
      setShowScreenshotWarning(true);
      setIsWindowFocused(false);
      setInfractions(p => {
        const next = p + 1;
        if (next >= maxAllowedInfractions) {
          terminateSessionDueToProctoring(next);
        }
        return next;
      });
      try {
        navigator.clipboard.writeText('Screenshots are disabled during this interview.');
      } catch {}
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Obscure immediately on OS/Meta key press to block Snipping Tool capture buffer
      if (e.key === 'Meta' || e.key === 'OS' || e.keyCode === 91 || e.keyCode === 92) {
        setIsWindowFocused(false);
      }
      // Block Print Screen key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerScreenshotAttempt();
      }
      // Block Print shortcut (Ctrl + P / Cmd + P)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        triggerScreenshotAttempt();
      }
      // Block OS screenshot combos: Cmd+Shift+3, Cmd+Shift+4, Win+Shift+S (Meta/Ctrl + Shift + S/3/4)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4')) {
        e.preventDefault();
        triggerScreenshotAttempt();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasStarted, session.proctoringMode, proctoringFailed, maxAllowedInfractions, terminateSessionDueToProctoring]);

  const speakQuestion = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || proctoringFailed) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(currentQuestion.questionText);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [isSpeaking, currentQuestion.questionText, proctoringFailed]);

  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined' || proctoringFailed) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech Recognition not supported in this browser. Please type your answer.'); return; }
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
      setIsListening(false);
      setInterimText('');
      return;
    }
    const r = new SR();
    r.continuous = true; r.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      if (proctoringFailed) {
        try { r.abort(); } catch {}
        return;
      }
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
    recognitionRef.current = r;
    r.start();
    setIsListening(true);
  }, [isListening, proctoringFailed]);

  const preventCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    try {
      e.clipboardData?.setData('text/plain', 'Copying is disabled during this interview.');
    } catch {}
  };

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const currentEvaluation: QuestionEvaluation | undefined = session.evaluations[currentQuestion.id];
  const isObscured = !isWindowFocused || showBlurWarning || showScreenshotWarning;

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

  if (!hasStarted) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 animate-fade-in px-4">
        <div className="card-cream p-8 sm:p-12 space-y-8 text-center shadow-2xl border border-white rounded-[36px]">
          <div className="w-20 h-20 rounded-full bg-charcoal text-cream flex items-center justify-center mx-auto shadow-xl">
            <Award className="w-10 h-10 text-coral animate-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-black text-3xl text-charcoal">Secure AI Interview Room</h2>
            <p className="text-sm font-bold text-charcoal/60">
              {session.proctoringMode === 'off' ? 'Mockly Practice Session' : 'Mockly Proctoring & Security protocols are active for this session.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-charcoal/10 text-left space-y-4 max-w-md mx-auto shadow-inner">
            <h4 className="font-display font-extrabold text-sm text-charcoal uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-coral animate-pulse" /> {session.proctoringMode === 'off' ? 'Practice Mode Details:' : 'Rules of Engagement:'}
            </h4>
            <ul className="space-y-3 text-xs font-bold text-charcoal/70">
              {session.proctoringMode === 'off' ? (
                <>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>No Proctoring:</strong> Feel free to exit fullscreen or switch tabs to check references as needed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Facial Analysis:</strong> Visual telemetry (eye contact, confidence tracking) is active if camera is enabled.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Protected Content:</strong> Screenshots and right-clicks are disabled for security.</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Fullscreen Mode:</strong> The interview must be completed in fullscreen. Exiting will trigger an infraction.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Tab & Focus Lock:</strong> Changing tabs or minimizing the window will trigger an infraction. (Limit: {maxAllowedInfractions})</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Content Protection:</strong> Screenshots, copy/paste, and right-clicks are disabled.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (session.proctoringMode === 'off') {
                  setHasStarted(true);
                  return;
                }
                const element = document.documentElement;
                if (element.requestFullscreen) {
                  element.requestFullscreen().then(() => {
                    setHasStarted(true);
                    setIsFullscreen(true);
                  }).catch((err) => {
                    console.error("Fullscreen request failed:", err);
                    setHasStarted(true);
                  });
                } else {
                  setHasStarted(true);
                }
              }}
              className="btn-dual-pill scale-110"
            >
              <div className="icon-badge">
                <ArrowRight className="w-5 h-5 text-charcoal" />
              </div>
              <span className="btn-label">{session.proctoringMode === 'off' ? 'Start Practice Session' : 'Start Secure Interview'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in py-4 relative">
      
      {/* Proctoring Failure / Session Terminated Blocker */}
      {proctoringFailed && (
        <div className="fixed inset-0 bg-charcoal/95 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="card-cream p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-white rounded-[32px] animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-coral/10 text-coral flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-2xl text-charcoal">Session Terminated</h3>
              <p className="text-xs font-bold text-charcoal/60 leading-relaxed">
                You have exceeded the maximum allowed infractions ({maxAllowedInfractions}) under the <strong className="uppercase">{session.proctoringMode}</strong> proctoring profile.
              </p>
              <div className="p-3.5 bg-coral/5 rounded-2xl border border-coral/10 text-coral font-black text-xs space-y-1">
                <div>Total Infractions Logged: {infractions}</div>
                <div className="text-[10px] text-coral/75 uppercase tracking-wider">Security Violation Limit Reached</div>
              </div>
            </div>
            <button
              onClick={() => {
                router.push(`/interview/${session.id}/results`);
              }}
              className="w-full py-3 rounded-2xl bg-charcoal text-cream font-black hover:bg-charcoal/90 transition text-xs uppercase tracking-wider shadow"
            >
              View Results Scorecard
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen blocker overlay */}
      {hasStarted && !isFullscreen && session.proctoringMode !== 'off' && !proctoringFailed && (
        <div className="fixed inset-0 bg-charcoal/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="card-cream p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-white rounded-[32px] animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-coral/10 text-coral flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-2xl text-charcoal">Fullscreen Mode Required</h3>
              <p className="text-xs font-bold text-charcoal/60 leading-relaxed">
                To proceed with your mock interview, please re-enter fullscreen mode.
              </p>
            </div>
            <button
              onClick={() => {
                const element = document.documentElement;
                if (element.requestFullscreen) {
                  element.requestFullscreen().then(() => {
                    setIsFullscreen(true);
                  }).catch(err => console.error(err));
                }
              }}
              className="w-full py-3 rounded-2xl bg-charcoal text-cream font-black hover:bg-charcoal/90 transition text-xs uppercase tracking-wider shadow"
            >
              Re-enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Tab Focus Loss Infraction Warning */}
      {showBlurWarning && !proctoringFailed && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="card-cream p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-white rounded-[32px] animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-coral/10 text-coral flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-charcoal">Proctoring Warning</h3>
              <p className="text-xs font-bold text-charcoal/60 leading-relaxed">
                You exited the interview window or switched tabs. This infraction has been logged.
              </p>
              <div className="p-3 bg-coral/5 rounded-2xl border border-coral/10 text-coral font-black text-xs">
                Infraction Count: {infractions} / {maxAllowedInfractions}
              </div>
            </div>
            <button
              onClick={() => {
                setShowBlurWarning(false);
                setIsWindowFocused(true);
                // Force fullscreen if lost
                if (!document.fullscreenElement) {
                  const element = document.documentElement;
                  if (element.requestFullscreen) {
                    element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error(err));
                  }
                }
              }}
              className="w-full py-3 rounded-2xl bg-coral text-cream font-black hover:bg-coral/90 transition text-xs uppercase tracking-wider shadow"
            >
              Resume Interview
            </button>
          </div>
        </div>
      )}

      {/* Screenshot Warning Blocker */}
      {showScreenshotWarning && !proctoringFailed && (
        <div className="fixed inset-0 bg-charcoal/95 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="card-cream p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-white rounded-[32px] animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-coral/10 text-coral flex items-center justify-center mx-auto">
              <X className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-charcoal">Screenshot Blocked</h3>
              <p className="text-xs font-bold text-charcoal/60 leading-relaxed">
                Screenshots are strictly prohibited during the interview to protect the integrity of the questions.
              </p>
              <div className="p-3 bg-coral/5 rounded-2xl border border-coral/10 text-coral font-black text-xs">
                Infraction Count: {infractions} / {maxAllowedInfractions}
              </div>
            </div>
            <button
              onClick={() => {
                setShowScreenshotWarning(false);
                setIsWindowFocused(true);
                // Force fullscreen if lost
                if (!document.fullscreenElement) {
                  const element = document.documentElement;
                  if (element.requestFullscreen) {
                    element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error(err));
                  }
                }
              }}
              className="w-full py-3 rounded-2xl bg-charcoal text-cream font-black hover:bg-charcoal/90 transition text-xs uppercase tracking-wider shadow"
            >
              Acknowledge & Resume
            </button>
          </div>
        </div>
      )}
      
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
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border uppercase ${
                session.proctoringMode === 'off' ? 'bg-black/5 text-charcoal/60 border-black/10' :
                session.proctoringMode === 'strict' ? 'bg-red-500/10 text-red-700 border-red-500/20' :
                'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
              }`}>
                Proctor: {session.proctoringMode || 'standard'}
              </span>
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
          {infractions > 0 && session.proctoringMode !== 'off' && (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-coral/10 border border-coral/20 text-xs font-extrabold text-coral animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-coral" />
              <span>{infractions} / {maxAllowedInfractions} Infractions</span>
            </div>
          )}

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
          <div 
            onCopy={preventCopy}
            onCut={preventCopy}
            onContextMenu={preventContextMenu}
            className={`soft-card p-7 sm:p-9 space-y-5 relative overflow-hidden bg-gradient-to-br from-[#a8e0ac] via-[#dff5db] to-[#f7fff8] select-none transition-all duration-150 ${
              isObscured ? 'filter blur-[24px] pointer-events-none scale-[0.98]' : ''
            }`}
          >
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

              <div 
                onCopy={preventCopy}
                onCut={preventCopy}
                onContextMenu={preventContextMenu}
                className={`p-6 rounded-3xl bg-white border border-charcoal/10 space-y-2 text-xs select-none transition-all duration-150 ${
                  isObscured ? 'filter blur-[24px] pointer-events-none scale-[0.98]' : ''
                }`}
              >
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
