'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Briefcase, Upload, CheckCircle2, AlertCircle, Brain, 
  Zap, Sparkles, Cpu, MessageSquare, Mic, Code2, Layers
} from 'lucide-react';
import { ExperienceLevel, InterviewSession } from '@/types';
import { generateInterviewQuestions } from '@/lib/gemini';
import { saveSession } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { AuthBlocker } from './AuthBlocker';
import { parsePdf, parseDocx } from '@/lib/fileParser';
import { Loader2 } from 'lucide-react';

const LOADING_STEPS = [
  { icon: Brain, text: 'Analyzing your resume & job description...', color: 'text-charcoal' },
  { icon: Cpu, text: 'Extracting skills & requirements...', color: 'text-charcoal' },
  { icon: MessageSquare, text: 'Generating tailored interview questions...', color: 'text-coral' },
  { icon: Sparkles, text: 'Preparing your AI interview room...', color: 'text-charcoal' },
];

export const ResumeJdUploader: React.FC = () => {
  const router = useRouter();
  
  const [targetRole, setTargetRole] = useState('Full Stack Web Developer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-Level (2-4 yrs)');
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [difficultyMode, setDifficultyMode] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [roundType, setRoundType] = useState<'technical_screen' | 'dsa' | 'system_design' | 'behavioral'>('technical_screen');
  const [aiEngine, setAiEngine] = useState<'gemini' | 'ollama'>('gemini');
  const [proctoringMode, setProctoringMode] = useState<'off' | 'standard' | 'strict'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isParsingJd, setIsParsingJd] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const quickRoles = [
    'Full Stack Web Developer',
    'Frontend Engineer (React / Next.js)',
    'Backend Engineer (Node / Go / Java)',
    'DevOps / Cloud Engineer',
    'Data Engineer / AI Engineer'
  ];

  // Animate loading steps
  useEffect(() => {
    if (!isLoading) { setLoadingStep(0); return; }
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'jd') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setParsing = type === 'resume' ? setIsParsingResume : setIsParsingJd;
    const setText = type === 'resume' ? setResumeText : setJobDescriptionText;

    setParsing(true);
    setErrorMsg('');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let extractedText = '';

      if (ext === 'pdf') {
        extractedText = await parsePdf(file);
      } else if (ext === 'docx') {
        extractedText = await parseDocx(file);
      } else {
        extractedText = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsText(file);
        });
      }

      if (extractedText.trim().length === 0) {
        throw new Error('No readable text content found in document.');
      }

      setText(extractedText);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Failed to extract text from ${file.name}. ${err.message || 'Please copy-paste manually.'}`);
    } finally {
      setParsing(false);
    }
  };

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setErrorMsg('Please specify your target job role.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      const { questions, extractedSkills } = await generateInterviewQuestions(
        targetRole, experienceLevel, resumeText, jobDescriptionText, questionCount, difficultyMode, roundType, aiEngine
      );
      const newSession: InterviewSession = {
        id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        targetRole: targetRole.trim(),
        experienceLevel,
        difficultyMode,
        roundType,
        aiEngine,
        resumeText: resumeText.trim() || undefined,
        jobDescriptionText: jobDescriptionText.trim() || undefined,
        extractedSkills,
        questions,
        evaluations: {},
        currentQuestionIndex: 0,
        status: 'in_progress',
        proctoringMode,
        infractions: 0,
        proctoringFailed: false,
      };
      saveSession(newSession);
      router.push(`/interview/${newSession.id}`);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Failed to generate interview. Please check inputs or try again.');
      setIsLoading(false);
    }
  };

  // Authentication Gate
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthBlocker
        title="Mock Interview Setup Locked"
        description="You must be signed in to configure and start an AI mock interview. Sign in or register below to build your customized session."
      />
    );
  }

  // Castrio Loading Overlay
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 animate-fade-in">
        <div className="card-cream p-10 sm:p-14 space-y-8 text-center shadow-2xl border border-white">
          <div className="w-20 h-20 rounded-full bg-charcoal text-cream flex items-center justify-center mx-auto shadow-xl animate-pulse-slow">
            <Brain className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-black text-3xl text-charcoal">Preparing Your Interview</h2>
            <p className="text-xs font-bold text-charcoal/60">Our AI engine is crafting personalized role questions</p>
          </div>

          <div className="space-y-3 text-left max-w-sm mx-auto">
            {LOADING_STEPS.map((step, idx) => {
              const isActive = idx === loadingStep;
              const isDone = idx < loadingStep;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                    isActive ? 'bg-white border border-charcoal/10 shadow-md scale-[1.02]'
                    : isDone ? 'bg-black/5 opacity-80'
                    : 'opacity-40'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-charcoal text-cream' : 'bg-charcoal/20'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-extrabold ${isActive ? 'text-charcoal' : 'text-charcoal/60'}`}>
                    {step.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* Header */}
      <div className="page-shell rounded-[36px] p-6 sm:p-8 text-center space-y-3 shadow-[0_20px_60px_rgba(27,30,22,0.06)]">
        <div className="section-chip mx-auto text-charcoal text-xs font-extrabold">
          <Brain className="w-4 h-4 text-coral" /> AI Interview Setup
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight">
          Create Your Mock Interview
        </h1>
        <p className="text-sm font-bold text-charcoal/60 max-w-xl mx-auto">
          Specify your target role and paste your resume & JD to generate role-tailored interview questions.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 0: Choose Your Round (Full Width Bento-style Card) */}
      <div className="soft-card p-7 sm:p-9 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-charcoal text-cream flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-charcoal">Interview Round Type</h3>
            <p className="text-xs font-bold text-charcoal/60">Choose which round you want to practice today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'technical_screen',
              title: 'Technical Screen',
              desc: 'General screening of tech stack, resume details, and light coding.',
              icon: Brain,
            },
            {
              id: 'dsa',
              title: 'Algorithms & DSA',
              desc: 'Core algorithmic round (Arrays, Trees, Graphs) with space/time complexity.',
              icon: Code2,
            },
            {
              id: 'system_design',
              title: 'System Design',
              desc: 'Distributed systems design, scale limits, caching, and databases.',
              icon: Layers,
            },
            {
              id: 'behavioral',
              title: 'Behavioral & HR',
              desc: 'Culture fit, conflict management, and STAR method leadership scenarios.',
              icon: MessageSquare,
            }
          ].map(round => {
            const Icon = round.icon;
            const active = roundType === round.id;
            return (
              <button
                key={round.id}
                type="button"
                onClick={() => setRoundType(round.id as any)}
                className={`p-5 rounded-3xl border-2 border-vast-ink text-left flex flex-col justify-between h-44 transition-all ${
                  active
                    ? 'bg-vast-ink text-lumen-cream scale-[1.02]'
                    : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-vast-ink ${
                  active ? 'bg-lavender-whisper text-vast-ink' : 'bg-vast-ink text-lumen-cream'
                } transition-all`}>
                  <Icon className={`w-5 h-5 ${active ? 'text-vast-ink' : 'text-lumen-cream'}`} />
                </div>
                <div className="space-y-1 mt-3">
                  <h4 className={`font-garamond text-xl font-normal ${active ? 'text-lumen-cream' : 'text-vast-ink'}`}>{round.title}</h4>
                  <p className={`text-xs leading-tight font-normal ${active ? 'text-lumen-stone' : 'text-fog'}`}>{round.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1: Role & Experience */}
        <div className="card-cream p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-ink text-lumen-cream flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-garamond font-normal text-2xl text-vast-ink">Target Position</h3>
              <p className="text-xs text-fog font-normal">Specify role & seniority level</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vast-ink mb-2">Target Job Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="input-wispr"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {quickRoles.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border-2 border-vast-ink transition ${
                    targetRole === role
                      ? 'bg-vast-ink text-lumen-cream'
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-charcoal mb-2">Experience Level</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Entry-Level / Junior', 'Mid-Level (2-4 yrs)', 'Senior (5+ yrs)', 'Lead / Architect'] as ExperienceLevel[]).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setExperienceLevel(level)}
                  className={`px-3 py-2.5 rounded-xl text-xs text-left font-semibold border-2 border-vast-ink transition ${
                    experienceLevel === level
                      ? 'bg-vast-ink text-lumen-cream'
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vast-ink mb-2">Difficulty Mode</label>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDifficultyMode(mode)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 border-vast-ink transition ${
                    difficultyMode === mode
                      ? 'bg-vast-ink text-lumen-cream'
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vast-ink mb-2 flex items-center justify-between">
              <span>Question Count</span>
              <span className="text-forest-ink font-semibold">{questionCount} Questions</span>
            </label>
            <div className="flex gap-2">
              {[3, 5, 7].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 border-vast-ink transition ${
                    questionCount === num
                      ? 'bg-vast-ink text-lumen-cream'
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vast-ink mb-2 flex items-center justify-between">
              <span>AI Model Engine</span>
              <span className="text-forest-ink font-semibold">{aiEngine === 'gemini' ? 'Gemini 1.5 Flash' : 'Ollama Local Host'}</span>
            </label>
            <div className="flex gap-2">
              {[
                { id: 'gemini', label: 'Gemini (Cloud)' },
                { id: 'ollama', label: 'Ollama (Local)' },
              ].map(engine => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => setAiEngine(engine.id as any)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 border-vast-ink transition ${
                    aiEngine === engine.id
                      ? 'bg-vast-ink text-lumen-cream'
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  {engine.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-vast-ink mb-2 flex items-center justify-between">
              <span>Proctoring Security Mode</span>
              <span className="text-forest-ink font-semibold">
                {proctoringMode === 'off' ? 'Disabled' : proctoringMode === 'strict' ? 'Strict Lock' : 'Standard'}
              </span>
            </label>
            <div className="flex gap-2">
              {[
                { id: 'off', label: 'Off', desc: 'No rules' },
                { id: 'standard', label: 'Standard', desc: '3 infractions' },
                { id: 'strict', label: 'Strict', desc: '1 infraction' },
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setProctoringMode(mode.id as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 border-vast-ink transition flex flex-col items-center justify-center ${
                    proctoringMode === mode.id
                      ? 'bg-vast-ink text-lumen-cream'
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  <span>{mode.label}</span>
                  <span className={`text-[9px] font-normal ${proctoringMode === mode.id ? 'text-lumen-stone' : 'text-fog'}`}>
                    {mode.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Resume & JD */}
        <div className="card-cream p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-ink text-lumen-cream flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-garamond font-normal text-2xl text-vast-ink">Resume & Job Context</h3>
              <p className="text-xs text-fog font-normal">Paste text or upload file (.txt, .md)</p>
            </div>
          </div>

          {/* Resume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-charcoal flex items-center gap-1.5">
                Resume / Bio {resumeText && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </label>
              <label className="cursor-pointer text-xs font-black text-coral hover:underline flex items-center gap-1">
                {isParsingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {isParsingResume ? 'Parsing...' : 'Upload (.pdf, .docx, .txt)'}
                <input type="file" accept=".pdf,.docx,.txt,.md,.json" onChange={(e) => handleFileUpload(e, 'resume')} className="hidden" disabled={isParsingResume} />
              </label>
            </div>
            <div className="relative">
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume summary, tech stack, past projects, or upload a document..."
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-2xl text-charcoal text-xs font-medium focus:outline-none focus:border-charcoal resize-none"
                disabled={isParsingResume}
              />
              {isParsingResume && (
                <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center text-xs font-extrabold text-charcoal gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-coral" />
                  <span>Extracting resume text...</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-charcoal flex items-center gap-1.5">
                Job Description {jobDescriptionText && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </label>
              <label className="cursor-pointer text-xs font-black text-coral hover:underline flex items-center gap-1">
                {isParsingJd ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {isParsingJd ? 'Parsing...' : 'Upload (.pdf, .docx, .txt)'}
                <input type="file" accept=".pdf,.docx,.txt,.md,.json" onChange={(e) => handleFileUpload(e, 'jd')} className="hidden" disabled={isParsingJd} />
              </label>
            </div>
            <div className="relative">
              <textarea
                rows={4}
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                placeholder="Paste the target job description requirements, or upload a document..."
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-2xl text-charcoal text-xs font-medium focus:outline-none focus:border-charcoal resize-none"
                disabled={isParsingJd}
              />
              {isParsingJd && (
                <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center text-xs font-extrabold text-charcoal gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-coral" />
                  <span>Extracting requirements...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Start Button Dual Pill */}
      <div className="text-center pt-2 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="btn-dual-pill scale-110 disabled:opacity-50"
        >
          <div className="icon-badge">
            <Mic className="w-5 h-5 text-charcoal" />
          </div>
          <span className="btn-label">Launch AI Session</span>
        </button>
      </div>

    </div>
  );
};
