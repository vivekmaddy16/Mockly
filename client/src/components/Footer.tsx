'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mic, BookOpen, BarChart3, Heart, 
  ArrowUpRight, Sparkles, Terminal, Code2, Layers, Cpu
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-24 bg-lumen-cream border-t-2 border-vast-ink">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">

        {/* Top Brand Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b-2 border-vast-ink/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-vast-ink text-lumen-cream flex items-center justify-center font-bold shadow-sm">
              <Mic className="w-5 h-5 text-lavender-whisper" />
            </div>
            <div>
              <span className="font-garamond text-3xl text-vast-ink tracking-tight font-normal">Mockly.ai</span>
              <p className="text-xs text-vast-ink/65 font-medium">AI-Powered Technical & Behavioral Interview Simulator</p>
            </div>
          </div>

          {/* Live Engine Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-vast-ink bg-white text-xs text-vast-ink font-semibold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-ink opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-ink" />
            </span>
            <span>Gemini 2.5 Evaluation Engine Active</span>
          </div>
        </div>

        {/* Main Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-forest-ink">
              Editorial Broadsheet Simulator
            </h4>
            <p className="text-sm text-vast-ink/75 leading-relaxed max-w-sm font-normal">
              Mockly transforms high-stakes technical preparation into structured practice. Synthesizing real-time voice speech dictation, STAR answer frameworks, and multi-dimensional scorecard telemetry.
            </p>
            <div className="pt-2">
              <Link
                href="/setup"
                className="btn-dual-pill text-xs inline-flex"
              >
                <div className="icon-badge">
                  <Mic className="w-3.5 h-3.5 text-lumen-cream" />
                </div>
                <span className="btn-label">Launch Practice Room</span>
              </Link>
            </div>
          </div>

          {/* Column 1: Studio Navigation */}
          <div className="space-y-3.5">
            <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-forest-ink">
              Studio
            </h4>
            <ul className="space-y-2.5 text-sm text-vast-ink/75">
              <li>
                <Link href="/setup" className="hover:text-forest-ink transition-colors flex items-center gap-2 font-medium">
                  <Mic className="w-3.5 h-3.5 text-forest-ink" /> AI Mock Interview
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-forest-ink transition-colors flex items-center gap-2 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-ember-glow" /> Topic Practice Hub
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-forest-ink transition-colors flex items-center gap-2 font-medium">
                  <BarChart3 className="w-3.5 h-3.5 text-vast-ink" /> Candidate Scorecard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-forest-ink transition-colors flex items-center gap-2 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-forest-ink" /> Cohort Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Core CS Curriculum */}
          <div className="space-y-3.5">
            <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-forest-ink">
              Curriculum
            </h4>
            <ul className="space-y-2.5 text-sm text-vast-ink/75">
              <li>
                <Link href="/practice" className="hover:text-forest-ink transition-colors flex items-center gap-2 font-medium">
                  <Code2 className="w-3.5 h-3.5 text-forest-ink" /> Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-forest-ink transition-colors flex items-center gap-2 font-medium">
                  <Layers className="w-3.5 h-3.5 text-ember-glow" /> System Design & Architecture
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-forest-ink transition-colors flex items-center gap-2 font-medium">
                  <Terminal className="w-3.5 h-3.5 text-vast-ink" /> DBMS & SQL Indexing
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-forest-ink transition-colors flex items-center gap-2 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-forest-ink" /> OS & Concurrency
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Capabilities */}
          <div className="space-y-3.5">
            <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-forest-ink">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-vast-ink/75 font-medium">
              <li>
                <Link href="/setup" className="hover:text-forest-ink transition-colors">
                  Speech-to-Text Dictation
                </Link>
              </li>
              <li>
                <Link href="/setup" className="hover:text-forest-ink transition-colors">
                  STAR Guided Prompt Drawer
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-forest-ink transition-colors">
                  Golden Answer Benchmarks
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-forest-ink transition-colors">
                  Multi-Domain Skill Radar
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Broadsheet Badge Strip */}
        <div className="border-t-2 border-vast-ink/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-vast-ink/70 font-normal">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <p>© {new Date().getFullYear()} Mockly.ai Inc. All rights reserved.</p>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              Built with <Heart className="w-3.5 h-3.5 text-ember-glow fill-ember-glow" /> for software engineers
            </span>
          </div>

          {/* Broadsheet Pill Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white border-2 border-vast-ink text-vast-ink font-semibold text-[11px] shadow-sm">
              Next.js 15
            </span>
            <span className="px-3 py-1 rounded-full bg-white border-2 border-vast-ink text-vast-ink font-semibold text-[11px] shadow-sm">
              Tailwind CSS
            </span>
            <span className="px-3 py-1 rounded-full bg-white border-2 border-vast-ink text-vast-ink font-semibold text-[11px] shadow-sm">
              Gemini 2.5
            </span>
            <span className="px-3 py-1 rounded-full bg-white border-2 border-vast-ink text-vast-ink font-semibold text-[11px] shadow-sm">
              Web Speech API
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
