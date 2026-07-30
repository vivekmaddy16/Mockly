'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Briefcase, Upload, CheckCircle2, AlertCircle, Brain, 
  Zap, Sparkles, Cpu, MessageSquare, Mic
} from 'lucide-react';
import { ExperienceLevel, InterviewSession } from '@/types';
import { generateInterviewQuestions } from '@/lib/gemini';
import { saveSession } from '@/lib/storage';

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'jd') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf' || ext === 'doc' || ext === 'docx') {
      setErrorMsg(`PDF and DOCX files contain binary layout encoding. Please open your ${file.name} file, copy the plain text, and paste it directly into the box below.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (type === 'resume') setResumeText(content);
      else setJobDescriptionText(content);
      setErrorMsg('');
    };
    reader.readAsText(file);
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
        targetRole, experienceLevel, resumeText, jobDescriptionText, questionCount, difficultyMode
      );
      const newSession: InterviewSession = {
        id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        targetRole: targetRole.trim(),
        experienceLevel,
        difficultyMode,
        resumeText: resumeText.trim() || undefined,
        jobDescriptionText: jobDescriptionText.trim() || undefined,
        extractedSkills,
        questions,
        evaluations: {},
        currentQuestionIndex: 0,
        status: 'in_progress'
      };
      saveSession(newSession);
      router.push(`/interview/${newSession.id}`);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Failed to generate interview. Please check inputs or try again.');
      setIsLoading(false);
    }
  };

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
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-charcoal/10 text-charcoal text-xs font-extrabold shadow-sm">
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

      {/* Main Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1: Role & Experience */}
        <div className="card-cream p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-charcoal text-cream flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-charcoal">Target Position</h3>
              <p className="text-xs font-bold text-charcoal/60">Specify role & seniority</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-charcoal mb-2">Target Job Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="input-castrio"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {quickRoles.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`text-[11px] px-3 py-1.5 rounded-full font-bold transition ${
                    targetRole === role
                      ? 'bg-charcoal text-cream shadow-sm'
                      : 'bg-white text-charcoal/70 border border-charcoal/10 hover:bg-cream'
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
                  className={`px-3 py-2.5 rounded-2xl text-xs text-left font-bold border transition ${
                    experienceLevel === level
                      ? 'bg-charcoal text-cream border-charcoal'
                      : 'bg-white text-charcoal/70 border-charcoal/10 hover:bg-cream'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-charcoal mb-2">Difficulty Mode</label>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDifficultyMode(mode)}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-black border transition ${
                    difficultyMode === mode
                      ? 'bg-charcoal text-cream border-charcoal'
                      : 'bg-white text-charcoal/70 border-charcoal/10 hover:bg-cream'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-charcoal mb-2 flex items-center justify-between">
              <span>Question Count</span>
              <span className="text-coral font-black">{questionCount} Questions</span>
            </label>
            <div className="flex gap-2">
              {[3, 5, 7].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-black border transition ${
                    questionCount === num
                      ? 'bg-charcoal text-cream border-charcoal'
                      : 'bg-white text-charcoal/70 border-charcoal/10 hover:bg-cream'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Resume & JD */}
        <div className="card-cream p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-charcoal text-cream flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-charcoal">Resume & Job Context</h3>
              <p className="text-xs font-bold text-charcoal/60">Paste text or upload file (.txt, .md)</p>
            </div>
          </div>

          {/* Resume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-charcoal flex items-center gap-1.5">
                Resume / Bio {resumeText && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </label>
              <label className="cursor-pointer text-xs font-black text-coral hover:underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload
                <input type="file" accept=".txt,.md,.json" onChange={(e) => handleFileUpload(e, 'resume')} className="hidden" />
              </label>
            </div>
            <textarea
              rows={4}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume summary, tech stack, past projects..."
              className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-2xl text-charcoal text-xs font-medium focus:outline-none focus:border-charcoal resize-none"
            />
          </div>

          {/* JD */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-charcoal flex items-center gap-1.5">
                Job Description {jobDescriptionText && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </label>
              <label className="cursor-pointer text-xs font-black text-coral hover:underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload
                <input type="file" accept=".txt,.md,.json" onChange={(e) => handleFileUpload(e, 'jd')} className="hidden" />
              </label>
            </div>
            <textarea
              rows={4}
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              placeholder="Paste the target job description requirements..."
              className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-2xl text-charcoal text-xs font-medium focus:outline-none focus:border-charcoal resize-none"
            />
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
