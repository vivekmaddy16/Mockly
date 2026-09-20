'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mic, BookOpen, BarChart3, Heart, 
  ArrowUpRight, Sparkles, Terminal, Code2, Layers, Cpu
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-24">
      <div className="bg-vast-ink text-lumen-cream rounded-t-[40px] md:rounded-t-[64px] border-t-2 border-vast-ink p-8 sm:p-14">
        <div className="max-w-[1200px] mx-auto space-y-12">

          {/* Top Brand Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-lumen-stone/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-lumen-cream text-vast-ink flex items-center justify-center font-bold shadow-md">
                <Mic className="w-5 h-5 text-forest-ink" />
              </div>
              <div>
                <span className="font-garamond text-3xl text-lumen-cream tracking-tight font-normal">Mockly.ai</span>
                <p className="text-xs text-fog font-medium">AI-Powered Tech & Behavioral Interview Simulator</p>
              </div>
            </div>

            {/* Live Engine Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs text-lumen-cream font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Gemini 2.5 Evaluation Engine Active</span>
            </div>
          </div>

          {/* Main Footer Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Brand Mission Column */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Editorial Broadsheet Simulator
              </h4>
              <p className="text-sm text-lumen-stone/80 leading-relaxed max-w-sm font-normal">
                Mockly transforms high-stakes technical preparation into structured practice. Synthesizing real-time voice speech dictation, STAR answer frameworks, and multi-dimensional scorecard telemetry.
              </p>
              <div className="pt-2">
                <Link
                  href="/setup"
                  className="inline-flex items-center gap-2 text-xs font-bold text-lavender-whisper hover:underline"
                >
                  <span>Launch Practice Simulator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 1: Studio Navigation */}
            <div className="space-y-3">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Studio
              </h4>
              <ul className="space-y-2.5 text-sm text-lumen-stone/75">
                <li>
                  <Link href="/setup" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-lavender-whisper" /> AI Mock Interview
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-ember-glow" /> Topic Practice Hub
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-lumen-cream" /> Candidate Scorecard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-lavender-whisper" /> Cohort Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Core CS Topics */}
            <div className="space-y-3">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Curriculum
              </h4>
              <ul className="space-y-2.5 text-sm text-lumen-stone/75">
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-lavender-whisper" /> Data Structures & Algorithms
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-ember-glow" /> System Design & Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-lumen-cream" /> DBMS & SQL Indexing
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-lavender-whisper" /> OS & Concurrency
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform Capabilities */}
            <div className="space-y-3">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Capabilities
              </h4>
              <ul className="space-y-2.5 text-sm text-lumen-stone/75">
                <li>
                  <Link href="/setup" className="hover:text-lumen-cream transition-colors">
                    Speech-to-Text Dictation
                  </Link>
                </li>
                <li>
                  <Link href="/setup" className="hover:text-lumen-cream transition-colors">
                    STAR Guided Prompt Drawer
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-lumen-cream transition-colors">
                    Golden Answer Benchmarks
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-lumen-cream transition-colors">
                    Multi-Domain Skill Radar
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Tech Stack Strip */}
          <div className="border-t border-lumen-stone/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fog">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <p>© {new Date().getFullYear()} Mockly.ai Inc. All rights reserved.</p>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                Built with <Heart className="w-3.5 h-3.5 text-ember-glow fill-ember-glow" /> for software engineers
              </span>
            </div>

            {/* High-Contrast Clear Tech Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-lumen-cream font-semibold text-[11px]">
                Next.js 15
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-lumen-cream font-semibold text-[11px]">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-lumen-cream font-semibold text-[11px]">
                Gemini 2.5
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-lumen-cream font-semibold text-[11px]">
                Web Speech API
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
