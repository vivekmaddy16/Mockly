'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Briefcase, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Brain,
  Zap,
  Code2
} from 'lucide-react';
import { ExperienceLevel, InterviewSession } from '@/types';
import { generateInterviewQuestions } from '@/lib/gemini';
import { saveSession } from '@/lib/storage';

export const ResumeJdUploader: React.FC = () => {
  const router = useRouter();
  
  const [targetRole, setTargetRole] = useState('Full Stack Web Developer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-Level (2-4 yrs)');
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const quickRoles = [
    'Full Stack Web Developer',
    'Frontend Engineer (React / Next.js)',
    'Backend Engineer (Node / Go / Java)',
    'DevOps / Cloud Engineer',
    'Data Engineer / AI Engineer'
  ];

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
        targetRole, experienceLevel, resumeText, jobDescriptionText, questionCount
      );
      const newSession: InterviewSession = {
        id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        targetRole: targetRole.trim(),
        experienceLevel,
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
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to generate interview. Please check inputs or try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-glow relative">
      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-300 text-xs font-semibold">
            <Brain className="w-4 h-4 text-brand-400" />
            Gemini AI Interview Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Create Your Personalized <span className="text-gradient-gold">Mock Interview</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Upload your resume and the Job Description. Mockly will analyze requirements to tailor exact technical & behavioral questions.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1: Role & Experience */}
          <div className="card-dark rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="icon-box icon-box-yellow">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Target Position</h3>
                <p className="text-xs text-neutral-500">Specify the role & seniority level</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Target Job Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="input-dark !pl-4"
              />
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {quickRoles.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                      targetRole === role
                        ? 'bg-brand-500/15 text-brand-300 border-brand-500/30 font-semibold'
                        : 'bg-neutral-900/50 text-neutral-500 border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Experience Level</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Entry-Level / Junior', 'Mid-Level (2-4 yrs)', 'Senior (5+ yrs)', 'Lead / Architect'] as ExperienceLevel[]).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperienceLevel(level)}
                    className={`px-3 py-2.5 rounded-xl text-xs text-left font-medium border transition ${
                      experienceLevel === level
                        ? 'bg-brand-500/15 text-brand-300 border-brand-500/30'
                        : 'bg-neutral-900/50 text-neutral-500 border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>Question Count</span>
                <span className="text-brand-400 font-bold">{questionCount} Questions</span>
              </label>
              <div className="flex gap-2">
                {[3, 5, 7].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                      questionCount === num
                        ? 'bg-brand-500/15 text-brand-300 border-brand-500/30'
                        : 'bg-neutral-900/50 text-neutral-500 border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Resume & JD */}
          <div className="card-dark rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="icon-box icon-box-blue">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Resume & Job Description</h3>
                <p className="text-xs text-neutral-500">Paste text or upload file (.txt, .md)</p>
              </div>
            </div>

            {/* Resume */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  Resume / Bio
                  {resumeText && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </label>
                <label className="cursor-pointer text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload
                  <input type="file" accept=".txt,.md,.json" onChange={(e) => handleFileUpload(e, 'resume')} className="hidden" />
                </label>
              </div>
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume summary, tech stack, past projects..."
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-neutral-800/80 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-brand-500/50 transition placeholder:text-neutral-600 resize-none font-mono"
              />
            </div>

            {/* JD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  Job Description
                  {jobDescriptionText && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </label>
                <label className="cursor-pointer text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload
                  <input type="file" accept=".txt,.md,.json" onChange={(e) => handleFileUpload(e, 'jd')} className="hidden" />
                </label>
              </div>
              <textarea
                rows={4}
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                placeholder="Paste the target job description requirements..."
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-neutral-800/80 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-brand-500/50 transition placeholder:text-neutral-600 resize-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center pt-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="btn-yellow text-sm px-10 py-4 inline-flex items-center gap-2.5 shadow-xl shadow-brand-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin" />
                Analyzing & Generating AI Interview...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Launch AI Mock Interview Room
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
