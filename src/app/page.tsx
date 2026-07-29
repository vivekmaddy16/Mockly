'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Code2, Briefcase, ArrowRight, FileText, Bot, Target, BookOpen, 
  BarChart3, Mic, ChevronDown, ChevronUp, Brain, Play, Sparkles, MessageSquare, 
  TrendingUp, Shield, Users, CheckCircle2, PlayCircle, Zap
} from 'lucide-react';

const faqs = [
  {
    q: 'How does the AI mock interview work?',
    a: 'Upload your resume and target Job Description. Our AI engine extracts key skills, generates personalized technical & behavioral questions matching the role, and evaluates your answers in real-time.',
  },
  {
    q: 'Do I need an API key?',
    a: 'No! Mockly includes a high-fidelity built-in evaluation engine that works out of the box. You can also optionally configure your Google Gemini API key.',
  },
  {
    q: 'What CS topics does the Practice Hub cover?',
    a: 'Data Structures & Algorithms (Arrays, Trees, Graphs, DP), OOPs, DBMS (SQL, ACID, Indexing), Operating Systems (Threads, Deadlocks), and Computer Networks (TCP/UDP, HTTP, DNS).',
  },
  {
    q: 'Can I practice with voice & speech?',
    a: 'Yes! Mockly supports Speech-to-Text (STT) for dictating your answers, and Text-to-Speech (TTS) for having the AI interviewer read questions aloud.',
  },
];

export default function HomePage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  return (
    <div className="space-y-12 py-4 animate-fade-in">
      
      {/* ═════════════════════════════════════════════════════════════
         CASTRIO HERO SECTION (Sage Green, Coral Hero, Speech Bubble Stack)
         ═════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Coral Hero Image Card */}
        <div className="lg:col-span-5 card-coral-hero p-8 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Top Pill Header */}
          <div className="flex items-center justify-between text-white/90 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Mockly.AI</span>
            </div>
            <span>24/7 AI Room</span>
          </div>

          {/* Center Title */}
          <div className="my-auto space-y-4 pt-6">
            <h1 className="font-display font-black text-4xl sm:text-5xl leading-none tracking-tight text-white">
              Join our<br />community
            </h1>
            <p className="text-sm text-white/80 font-medium max-w-xs leading-relaxed">
              Connect with over 5,000+ candidates practicing real-time AI mock interviews.
            </p>
          </div>

          {/* Floating Action Pill */}
          <div className="pt-4 flex items-center justify-start">
            <Link href="/setup" className="btn-dual-pill">
              <div className="icon-badge">
                <Mic className="w-4 h-4 text-charcoal" />
              </div>
              <span className="btn-label">Join Community</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Castrio Grid (Speech Bubble, Circular Badge, Mint Card) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Top Card 1: Community Speech Bubble Banner */}
          <div className="sm:col-span-2 card-cream p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-xl text-charcoal">
                Interactive Practice Hub
              </h3>
              <p className="text-xs text-charcoal/70 font-medium">
                Our community contains amazing interviewers and 5k+ candidate followers.
              </p>
            </div>

            {/* Castrio Speech Bubble Avatar Stack Badge */}
            <div className="speech-bubble-badge shrink-0">
              <div className="avatar-stack">
                <div className="avatar-circle bg-amber-400 text-charcoal text-[10px] font-black flex items-center justify-center">JD</div>
                <div className="avatar-circle bg-indigo-500 text-white text-[10px] font-black flex items-center justify-center">AL</div>
                <div className="avatar-circle bg-coral text-white text-[10px] font-black flex items-center justify-center">MK</div>
              </div>
              <span className="text-xs font-extrabold text-charcoal">Join 89+ online</span>
            </div>
          </div>

          {/* Middle Card 2: Mint Gradient Feature Container */}
          <div className="card-mint-gradient p-7 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal/60">Automated Feedback</span>
              <h3 className="font-display font-black text-2xl text-charcoal leading-tight">
                Create & ace your interviews
              </h3>
            </div>

            <Link href="/setup" className="btn-dual-pill-light w-fit mt-4">
              <div className="icon-badge">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="btn-label">Switch to Mockly</span>
            </Link>
          </div>

          {/* Middle Card 3: Circular Rotating Badge & Stats */}
          <div className="card-cream p-7 flex flex-col justify-between items-center text-center min-h-[220px]">
            {/* Castrio Circular Spinning Text Badge */}
            <div className="circular-text-badge my-auto">
              <svg className="rotating-svg" viewBox="0 0 100 100">
                <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                <text className="text-[9px] font-black uppercase fill-white tracking-widest">
                  <textPath href="#circlePath" startOffset="0%">
                    Play Interview • Play Interview •
                  </textPath>
                </text>
              </svg>
              <Link href="/setup" className="w-12 h-12 rounded-full bg-white text-charcoal flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-charcoal ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Bottom Card 4: Extended Numerical Stat Counters */}
          <div className="sm:col-span-2 card-cream p-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div>
              <span className="font-display font-black text-4xl sm:text-5xl text-charcoal block">34K</span>
              <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Candidates Joined</span>
            </div>
            <div>
              <span className="font-display font-black text-4xl sm:text-5xl text-charcoal block">130</span>
              <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Roles & JDs</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="font-display font-black text-4xl sm:text-5xl text-coral block">98%</span>
              <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Accuracy Score</span>
            </div>
          </div>

        </div>
      </div>

      {/* ════════ FEATURE CARDS (Castrio Cream Grid) ════════ */}
      <section className="space-y-8 pt-6">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal">
            Everything you need for tech interviews
          </h2>
          <p className="text-sm font-bold text-charcoal/60 max-w-md mx-auto">
            From resume ATS skill parsing to real-time speech evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Resume & JD Parsing', desc: 'AI extracts candidate skills and generates tailored role questions.', icon: FileText },
            { title: 'AI Audio Simulator', desc: 'Real-time speech-to-text dictation & AI interviewer audio voice.', icon: Bot },
            { title: 'STAR Evaluation', desc: 'Instant breakdown across Technical Depth, STAR Structure, and Clarity.', icon: Target },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="card-cream p-8 space-y-4 hover:translate-y-[-4px] transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-charcoal text-cream flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-charcoal">{f.title}</h3>
                <p className="text-xs font-medium text-charcoal/70 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════ FAQ SECTION ════════ */}
      <section className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal">
            Frequently Asked Questions
          </h2>
          <p className="text-xs font-bold text-charcoal/60">
            Got questions? We have got answers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="card-cream overflow-hidden">
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-sm text-charcoal"
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? <ChevronUp className="w-4 h-4 text-charcoal shrink-0" /> : <ChevronDown className="w-4 h-4 text-charcoal/60 shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaqIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-charcoal/80 font-medium leading-relaxed border-t border-charcoal/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ FINAL CTA BAR ════════ */}
      <section className="card-charcoal p-10 sm:p-14 text-center space-y-6">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-cream">
          Ready to master your next interview?
        </h2>
        <p className="text-xs text-cream/70 font-medium max-w-md mx-auto">
          Start a real-time AI mock session tailored to your targeted role in under 30 seconds.
        </p>
        <Link href="/setup" className="btn-dual-pill-light mx-auto">
          <div className="icon-badge">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="btn-label">Launch AI Session</span>
        </Link>
      </section>

    </div>
  );
}
