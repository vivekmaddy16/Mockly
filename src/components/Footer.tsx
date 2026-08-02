'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Shield, Cpu, BookOpen, Layers, Heart, ArrowRight, 
  CheckCircle2, Mic, PlayCircle, BarChart3, Github, Twitter, Linkedin, 
  Globe, Zap, Bot, Mail, Check
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full px-4 sm:px-8 mt-16 pb-8">
      <div className="max-w-7xl mx-auto space-y-10 rounded-[40px] bg-charcoal text-cream p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

        {/* ═════════════════════════════════════════════════════════════
           TOP NEWSLETTER / INTERVIEW INSIGHTS STRIP
           ═════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-neutral-900/90 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-lime-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Weekly Interview Questions
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white">
              Get High-Frequency FAANG Technical Questions In Your Inbox
            </h3>
            <p className="text-xs text-neutral-400 font-medium max-w-xl">
              Curated System Design architectures, DSA tricks, and STAR behavioral prompt breakdowns sent weekly.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            {isSubscribed ? (
              <div className="px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" /> Subscribed successfully!
              </div>
            ) : (
              <>
                <div className="relative w-full sm:w-72">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-neutral-950 border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-lime-400 transition-all font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-lime-400 text-charcoal font-black text-xs hover:bg-lime-300 transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </form>
        </div>

        {/* ═════════════════════════════════════════════════════════════
           MAIN FOOTER NAVIGATION COLUMNS
           ═════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">
          
          {/* Brand & Mission Column (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-lime-400 text-charcoal flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <div className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-0.5">
                <span>Mockly</span>
                <span className="text-lime-400">.ai</span>
              </div>
            </Link>

            <p className="text-xs font-medium text-neutral-400 leading-relaxed max-w-sm">
              An AI-powered technical & behavioral interview simulator system tailored to your exact <strong>resume</strong> and target <strong>job description</strong>. Real-time voice speech dictation, STAR answer hints, and executive candidate scorecards.
            </p>

            {/* AI Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Gemini 1.5 AI Evaluation Engine Active</span>
            </div>
          </div>

          {/* Column 1: Interview Studio */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-lime-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Studio Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-neutral-400">
              <li>
                <Link href="/setup" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" /> AI Mock Interview
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Topic Practice Hub
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-lime-400" /> Candidate Readiness
                </Link>
              </li>
              <li>
                <Link href="/reset-password" className="hover:text-white transition-colors">
                  Account Recovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CS Topics */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-lime-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Core CS Topics
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-neutral-400">
              <li><Link href="/practice" className="hover:text-white transition-colors">Data Structures & Algorithms</Link></li>
              <li><Link href="/practice" className="hover:text-white transition-colors">Distributed System Design</Link></li>
              <li><Link href="/practice" className="hover:text-white transition-colors">DBMS & SQL Indexing</Link></li>
              <li><Link href="/practice" className="hover:text-white transition-colors">Operating Systems & Concurrency</Link></li>
              <li><Link href="/practice" className="hover:text-white transition-colors">STAR Behavioral Framework</Link></li>
            </ul>
          </div>

          {/* Column 3: AI Engine & Tech */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-lime-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Platform Specs
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-neutral-400">
              <li className="flex items-center gap-1.5 text-neutral-300">
                <Bot className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                Google Gemini AI Integration
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Real-Time Speech Dictation
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                STAR Framework Advice Drawer
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Side-by-Side Model Answers
              </li>
            </ul>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════
           BOTTOM COPYRIGHT & TECH STACK BADGES
           ═════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-neutral-400">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <p>© {new Date().getFullYear()} Mockly.ai Inc. All rights reserved.</p>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="text-neutral-500 flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-coral fill-coral" /> for candidates & software engineers
            </span>
          </div>

          {/* Tech Badges */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Next.js 15</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Tailwind CSS</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Gemini AI</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
