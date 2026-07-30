'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Play, ArrowUpRight, Sparkles, ChevronDown, ChevronUp, 
  Brain, FileText, Bot, Target, BookOpen, BarChart3, Zap, GraduationCap, Code2, Briefcase, Shield, MessageSquare, TrendingUp
} from 'lucide-react';

const faqs = [
  {
    q: 'How does the AI mock interview work?',
    a: 'Upload your resume and target Job Description. Our Gemini AI engine extracts your skills, generates personalized technical & behavioral questions matching the JD, and evaluates your answers in real-time across structure, technical accuracy, and communication clarity.',
  },
  {
    q: 'Do I need a Gemini API key?',
    a: 'No! Mockly includes a high-fidelity built-in AI evaluation engine that works out of the box. You can also configure your Google Gemini API key in the .env environment file.',
  },
  {
    q: 'What topics does the Practice Hub cover?',
    a: 'Data Structures & Algorithms (Arrays, Trees, Graphs, DP), OOPs (Polymorphism, Abstraction, Inheritance), DBMS (ACID, Indexing, Normalization), Operating Systems (Processes, Threads, Deadlocks), and Computer Networks (TCP/UDP, HTTP, DNS).',
  },
  {
    q: 'Can I practice with voice & speech?',
    a: 'Yes! Mockly supports Speech-to-Text (STT) for dictating your answers using your microphone, and Text-to-Speech (TTS) to have the AI interviewer read questions aloud.',
  },
  {
    q: 'Is my interview history saved securely?',
    a: 'Yes! Your profile, interview history, scores, and progress tracker are saved to your secure user account backed by MongoDB and JWT token authentication.',
  },
];

export default function HomePage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const features = [
    {
      icon: FileText,
      title: 'Resume & JD Parsing',
      description: 'Upload your resume and target Job Description. AI extracts key skills and generates custom questions tailored to your target role.',
    },
    {
      icon: Bot,
      title: 'AI Interview Simulator',
      description: 'Interactive interview room with AI persona. Voice dictation, real-time audio visualizer, code snippets, and STAR framework hints.',
    },
    {
      icon: Target,
      title: 'Multi-Dimensional Grading',
      description: 'Instant evaluation across Technical Depth, Answer Structure, and Clarity. Detailed side-by-side model answer comparisons included.',
    },
    {
      icon: BookOpen,
      title: 'CS Topic & Roadmap Hub',
      description: 'Master core fundamentals: DSA, OOPs, DBMS, OS, Computer Networks, and System Design with an interactive node roadmap tree.',
    },
    {
      icon: BarChart3,
      title: 'Readiness Dashboard',
      description: 'Visualize your interview score trends, domain competency radar chart, weak area alerts, and searchable session history.',
    },
    {
      icon: Mic,
      title: 'Voice & Audio Mode',
      description: 'Practice speaking answers aloud with built-in Speech-to-Text dictation and Text-to-Speech question readouts.',
    },
  ];

  return (
    <div className="space-y-12 py-2 animate-fade-in">
      
      {/* ═════════════════════════════════════════════════════════════
         CASTRIO LAYOUT HERO SHEET (Centered White Sheet, Sage Outer Frame)
         ═════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-[40px] shadow-2xl p-6 sm:p-12 sm:pb-8 space-y-6 border border-white relative overflow-hidden">
        
        {/* ─── Hero Headline & Inline Avatar Section ────────────── */}
        <div className="relative pt-2">
          
          {/* Vertical Scroll Badge Right */}
          <div className="hidden lg:flex absolute top-2 right-0 vertical-scroll-badge">
            <span>♦ Scroll Down ♦</span>
          </div>

          <div className="max-w-4xl space-y-4">
            {/* Giant Syne Extended Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-charcoal">
              Master & ace <br />
              your int
              {/* Circular Dashed Avatar Frame inset in the word 'interview' */}
              <span className="inline-flex items-center justify-center align-middle mx-1 sm:mx-2 w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-charcoal/60 bg-cream overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-coral to-amber-400 flex items-center justify-center text-white font-black text-sm sm:text-lg">
                  AI
                </div>
              </span>
              erview
            </h1>

            {/* Subtext & Action Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-2">
              
              {/* Left Subtext & Lime Green Dual Pill Button */}
              <div className="md:col-span-7 space-y-4">
                <p className="text-xs sm:text-sm font-medium text-charcoal/70 max-w-md leading-relaxed">
                  Prepare for your next technical interview with AI-powered mock sessions tailored to your resume and target job description.
                </p>

                {/* Castrio Lime Green Dual Pill `( 🎙️ ) [ Start Mock Interview ]` */}
                <Link href="/setup" className="btn-dual-pill-lime">
                  <div className="icon-badge">
                    <Mic className="w-4 h-4 text-charcoal" />
                  </div>
                  <span className="btn-label">Start Mock Interview</span>
                </Link>
              </div>

              {/* Right Community Speech Bubble Badge */}
              <div className="md:col-span-5 flex flex-col items-start md:items-end space-y-2">
                <p className="text-[11px] font-extrabold text-charcoal/60 text-left md:text-right max-w-xs leading-normal">
                  Our Community contains over 5,000+ candidates acing tech interviews at top companies.
                </p>

                {/* Speech Bubble Badge `Join 5k+ candidates` */}
                <div className="speech-bubble-badge">
                  <span className="text-xs font-extrabold text-cream">
                    Join 5,000+ Candidates
                  </span>
                  <div className="avatar-stack">
                    <div className="avatar-circle bg-amber-400 text-charcoal text-[10px] font-black flex items-center justify-center">JD</div>
                    <div className="avatar-circle bg-coral text-white text-[10px] font-black flex items-center justify-center">MK</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Hero Bottom Sage Banner & Floating Preview Card ───── */}
        <div className="relative rounded-[36px] bg-[#CBD7B8] p-6 sm:p-8 border border-charcoal/5 space-y-6 overflow-hidden min-h-[300px] mt-2">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center max-w-xl">
            
            {/* Audio Waveform Bars Graphic */}
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-1 h-8">
                <div className="w-1 bg-charcoal h-4 rounded-full" />
                <div className="w-1 bg-charcoal h-8 rounded-full" />
                <div className="w-1 bg-charcoal h-6 rounded-full" />
                <div className="w-1 bg-charcoal h-7 rounded-full" />
                <div className="w-1 bg-charcoal h-3 rounded-full" />
              </div>
              <span className="font-display font-extrabold text-sm text-charcoal ml-2">Mock Interviews</span>
            </div>

            {/* Stat 1 */}
            <div>
              <span className="font-display font-black text-4xl sm:text-5xl text-charcoal block">34K</span>
              <span className="text-xs font-bold text-charcoal/70 uppercase">Interviews Conducted</span>
            </div>

            {/* Stat 2 */}
            <div>
              <span className="font-display font-black text-4xl sm:text-5xl text-charcoal block">130+</span>
              <span className="text-xs font-bold text-charcoal/70 uppercase">Roles & JDs Covered</span>
            </div>
          </div>

          {/* Floating Tilting Card Preview (Bottom Right) */}
          <div className="relative sm:absolute bottom-4 right-4 sm:right-10 w-full sm:w-72 bg-white rounded-3xl p-6 shadow-2xl border border-charcoal/10 space-y-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-xs text-charcoal">Readiness Score</span>
              <div className="w-8 h-8 rounded-full bg-[#C5F874] flex items-center justify-center text-charcoal font-bold">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="avatar-stack">
                <div className="avatar-circle bg-indigo-500 text-white text-[10px] font-black flex items-center justify-center">AL</div>
                <div className="avatar-circle bg-coral text-white text-[10px] font-black flex items-center justify-center">MK</div>
                <div className="avatar-circle bg-amber-400 text-charcoal text-[10px] font-black flex items-center justify-center">JD</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-charcoal/5">
              <span className="font-display font-black text-2xl text-charcoal">88%</span>
              <Link href="/setup" className="px-4 py-2 rounded-full bg-charcoal text-white text-xs font-bold hover:bg-charcoal-light">
                Start Session &gt;&gt;
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* ════════ FEATURE CARDS (Castrio Grid Layout) ════════ */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal">
            Level up your interview performance
          </h2>
          <p className="text-xs font-bold text-charcoal/60 max-w-md mx-auto">
            Everything you need to go from preparing your resume to acing real technical interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="card-cream p-8 space-y-4 hover:translate-y-[-4px] transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-charcoal text-cream flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-charcoal">{f.title}</h3>
                <p className="text-xs font-medium text-charcoal/70 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════ FAQ SECTION ════════ */}
      <section className="max-w-3xl mx-auto space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal">
            Frequently Asked Questions
          </h2>
          <p className="text-xs font-bold text-charcoal/60">
            Everything you need to know about Mockly
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
          Ready to ace your next technical interview?
        </h2>
        <p className="text-xs text-cream/70 font-medium max-w-md mx-auto">
          Start a real-time AI mock session tailored to your targeted role in under 30 seconds.
        </p>
        <Link href="/setup" className="btn-dual-pill-lime mx-auto">
          <div className="icon-badge">
            <Zap className="w-4 h-4 text-charcoal" />
          </div>
          <span className="btn-label">Launch AI Session</span>
        </Link>
      </section>

    </div>
  );
}
