'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mic, BookOpen, BarChart3, Heart, 
  Sparkles, Terminal, Code2, Layers, Cpu, LogIn, Activity, Compass, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const handleOpenAuth = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mockly:openAuthModal', { detail: { mode: 'login' } }));
    }
  };

  return (
    <footer className="w-full mt-20">
      <div className="bg-vast-ink text-lumen-cream rounded-t-[40px] md:rounded-t-[64px] border-t-2 border-vast-ink p-8 sm:p-14">
        <div className="max-w-[1200px] mx-auto space-y-12">

          {/* Top Brand & Telemetry Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-lumen-stone/15">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-lumen-cream text-vast-ink flex items-center justify-center font-bold shadow-md">
                <Mic className="w-5 h-5 text-forest-ink" />
              </div>
              <div>
                <span className="font-garamond text-3xl text-lumen-cream tracking-tight font-normal">Mockly.ai</span>
                <p className="text-xs text-lumen-stone/70 font-medium">AI-Powered Technical & STAR Interview Preparation</p>
              </div>
            </div>

            {/* Pulsing AI Engine Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-xs text-lumen-cream font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Gemini 2.5 Evaluation Engine Active</span>
            </div>
          </div>

          {/* Main Footer Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Column 1: Brand Mission */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Editorial Broadsheet Simulator
              </h4>
              <p className="text-sm text-lumen-stone/85 leading-relaxed max-w-sm font-normal">
                An AI-powered technical & behavioral interview simulator. Practice real-time voice speech dictation, STAR answer hints, and objective multi-dimensional candidate scorecards.
              </p>
              <div className="pt-2">
                <Link
                  href="/setup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-lavender-whisper text-vast-ink font-semibold text-xs border border-vast-ink hover:brightness-95 transition"
                >
                  <Mic className="w-3.5 h-3.5 text-forest-ink" />
                  <span>Start Practice Session</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 2: Studio Navigation */}
            <div className="space-y-3.5">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Studio Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-lumen-stone">
                <li>
                  <Link href="/setup" className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium">
                    <Mic className="w-3.5 h-3.5 text-lavender-whisper" /> AI Mock Interview
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-ember-glow" /> Topic Practice Hub
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium">
                    <BarChart3 className="w-3.5 h-3.5 text-lumen-cream" /> Candidate Scorecard
                  </Link>
                </li>
                <li>
                  {isAuthenticated ? (
                    <Link href="/dashboard" className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-lavender-whisper" /> My Account
                    </Link>
                  ) : (
                    <button
                      onClick={handleOpenAuth}
                      className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium text-left"
                    >
                      <LogIn className="w-3.5 h-3.5 text-lavender-whisper" /> Candidate Sign In
                    </button>
                  )}
                </li>
              </ul>
            </div>

            {/* Column 3: Core CS Topics */}
            <div className="space-y-3.5">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Core Curriculum
              </h4>
              <ul className="space-y-2.5 text-sm text-lumen-stone">
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium">
                    <Code2 className="w-3.5 h-3.5 text-lavender-whisper" /> Data Structures & Algorithms
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium">
                    <Layers className="w-3.5 h-3.5 text-ember-glow" /> System Design & Scaling
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium">
                    <Terminal className="w-3.5 h-3.5 text-lumen-cream" /> DBMS & SQL Indexing
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2 font-medium">
                    <Cpu className="w-3.5 h-3.5 text-lavender-whisper" /> OS & Concurrency
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Platform Resources & Real Links */}
            <div className="space-y-3.5">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Platform Resources
              </h4>
              <ul className="space-y-2.5 text-sm text-lumen-stone font-medium">
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-ember-glow" /> Learning Roadmap
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-lavender-whisper" /> Skill Radar Map
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Cohort User Study
                  </Link>
                </li>
                <li>
                  <Link href="/setup" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-lumen-cream" /> Speech Dictation Studio
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Visible High-Contrast Badges */}
          <div className="border-t border-lumen-stone/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-lumen-stone/70">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <p>© {new Date().getFullYear()} Mockly.ai Inc. All rights reserved.</p>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                Built with <Heart className="w-3.5 h-3.5 text-ember-glow fill-ember-glow" /> for software engineers
              </span>
            </div>

            {/* High-Contrast Visible Tech Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-lumen-cream font-semibold text-[11px] shadow-sm">
                Next.js 15
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-lumen-cream font-semibold text-[11px] shadow-sm">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-lumen-cream font-semibold text-[11px] shadow-sm">
                Gemini 2.5 Flash
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-lumen-cream font-semibold text-[11px] shadow-sm">
                Web Speech API
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
