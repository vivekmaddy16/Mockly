'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Play, ArrowRight, ArrowUpRight, Sparkles, ChevronDown, ChevronUp, 
  Brain, FileText, Bot, Target, BookOpen, BarChart3, Zap, GraduationCap, 
  Code2, Briefcase, Shield, MessageSquare, TrendingUp, CheckCircle2, 
  Volume2, Award, ArrowLeft, Users, Star, Layers, Activity
} from 'lucide-react';

const faqs = [
  {
    num: '01',
    q: 'How does the AI mock interview work?',
    a: 'Upload your resume and target Job Description. Our Gemini AI engine extracts your key skills, generates realistic technical & behavioral questions matching the role, and evaluates your spoken answers in real-time across structure, technical depth, and articulation.',
  },
  {
    num: '02',
    q: 'Do I need a custom Gemini API key?',
    a: 'No! Mockly includes a high-fidelity built-in AI evaluation engine ready out of the box. You can also connect your own Google Gemini API key via the settings panel or environment configuration.',
  },
  {
    num: '03',
    q: 'What topics does the Practice Hub cover?',
    a: 'Data Structures & Algorithms (Arrays, Trees, Graphs, DP), OOPs (Polymorphism, Abstraction, Encapsulation), DBMS (ACID, Indexing, Transactions), Operating Systems (Processes, Threads, Deadlocks), and System Design Architecture.',
  },
  {
    num: '04',
    q: 'Can I practice with voice dictation & speech readout?',
    a: 'Yes! Mockly features full real-time Speech-to-Text (STT) for dictating your responses using your microphone, and Text-to-Speech (TTS) so the AI interviewer reads questions aloud naturally.',
  },
  {
    num: '05',
    q: 'Is my interview history and readiness score saved?',
    a: 'Yes! All your mock interview sessions, STAR feedback, scorecards, model answer comparisons, and domain mastery charts are securely stored in your personal account dashboard.',
  },
];

const featureTabs = [
  {
    id: '01',
    label: '/01 Voice AI Simulator',
    title: 'Real-Time Voice Dictation & AI Audio Persona',
    subtitle: 'Practice like a real interview with natural speech-to-text dictation, live audio visualizer waveforms, and AI interviewer audio readouts.',
    badge: 'Live Audio Mode',
    previewType: 'voice',
    bullets: [
      'Interactive Speech-to-Text dictation with live visualizer',
      'Pulsing AI avatar indicator during question readouts',
      'Instant STAR framework hints during active recording'
    ]
  },
  {
    id: '02',
    label: '/02 STAR Guidance Drawer',
    title: 'Structured STAR Framework Drawer',
    subtitle: 'Never fumble during behavioral or situational questions. Access instant advice on Situation, Task, Action, and Result right inside the studio.',
    badge: 'Behavioral Framework',
    previewType: 'star',
    bullets: [
      'Collapsible slide-over drawer with real-time prompt hints',
      'Structured answer templates for Amazon, Google & Meta style rounds',
      'Side-by-side golden model answer comparisons'
    ]
  },
  {
    id: '03',
    label: '/03 Multi-Metric Scorecard',
    title: 'Executive Performance Scorecard & Analytics',
    subtitle: 'Get objective scoring across Technical Depth, STAR Structure, and Articulation Clarity, paired with interactive domain radar graphs.',
    badge: 'AI Analytics',
    previewType: 'scorecard',
    bullets: [
      'Animated readiness gauge classifying FAANG candidacy',
      'Side-by-side candidate answer vs golden AI solution comparison',
      'Radar mastery chart for DSA, OOPs, DBMS, OS & System Design'
    ]
  },
  {
    id: '04',
    label: '/04 CS Roadmap Tree',
    title: 'Structured Computer Science Roadmap',
    subtitle: 'Step-by-step milestone nodes for CS fundamentals and System Design, tracking your progress from beginner to FAANG-ready engineer.',
    badge: 'Curriculum Tree',
    previewType: 'roadmap',
    bullets: [
      'Interactive milestone nodes connected to practice quizzes',
      'Structured resource drawers with curated reading & coding sets',
      'Automated topic streak and progress tracking'
    ]
  }
];

const testimonials = [
  {
    id: '01',
    quote: "With Mockly's AI-powered voice studio, STAR guidance, and side-by-side model answer comparison, clearing my FAANG technical interview was seamless and confident!",
    name: "Aarav Sharma",
    role: "Senior Software Engineer @ TechCorp",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: '02',
    quote: "The real-time audio visualizer and multi-dimensional grading gave me instant feedback on my technical depth and articulation clarity. Absolutely game-changing!",
    name: "Priya Nair",
    role: "Full Stack Engineer @ CloudScale",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: '03',
    quote: "Resume & JD matching helped me practice exact questions asked in System Design and DSA rounds. I went into my interviews completely prepared.",
    name: "Rohan Verma",
    role: "Backend Architect @ DataFlow",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
  }
];

export default function HomePage() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const currentTab = featureTabs[activeTabIdx];
  const currentTestimonial = testimonials[activeTestimonialIdx];

  const handleNextTab = () => {
    setActiveTabIdx((prev) => (prev + 1) % featureTabs.length);
  };

  const handlePrevTab = () => {
    setActiveTabIdx((prev) => (prev - 1 + featureTabs.length) % featureTabs.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="space-y-16 py-2 animate-fade-in text-charcoal">
      
      {/* ═════════════════════════════════════════════════════════════
         DRIBBBLE-INSPIRED HERO SECTION (Clean White Sheet, Editorial Contrast)
         ═════════════════════════════════════════════════════════════ */}
      <section className="bg-white rounded-[40px] shadow-2xl p-6 sm:p-12 space-y-10 border border-white relative overflow-hidden">
        
        {/* Top Header / Navigation Strip */}
        <header className="flex items-center justify-between border-b border-neutral-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center font-black text-lg">
              M
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-charcoal">
              Mockly<span className="text-lime-500">.ai</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-neutral-600">
            <a href="#features" className="hover:text-charcoal transition-colors">Features</a>
            <a href="#insights" className="hover:text-charcoal transition-colors">Practice Hub</a>
            <a href="#testimonials" className="hover:text-charcoal transition-colors">Success Stories</a>
            <a href="#faq" className="hover:text-charcoal transition-colors">FAQ</a>
          </nav>

          {/* Pill Action Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              href="/setup" 
              className="px-5 py-2.5 rounded-full border border-neutral-300 font-bold text-sm text-charcoal hover:bg-neutral-50 transition-all"
            >
              Start Practice
            </Link>
            <Link 
              href="/dashboard" 
              className="px-5 py-2.5 rounded-full bg-charcoal text-white font-bold text-sm hover:bg-neutral-800 shadow-md transition-all flex items-center gap-2"
            >
              Dashboard <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Giant Headline Section */}
        <div className="space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-700 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-coral" /> Next-Gen AI Interview Simulator
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.98] tracking-tight text-charcoal max-w-5xl">
            The Nex<span className="text-neutral-400">t</span> AI Interview Solution
          </h1>
        </div>

        {/* Split Visual & Content Grid (Directly matching Dribbble Hero Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          
          {/* Left Visual Studio Card (7 Cols) */}
          <div className="lg:col-span-7 bg-neutral-900 rounded-[32px] p-6 sm:p-8 text-white relative min-h-[360px] flex flex-col justify-between overflow-hidden shadow-xl group">
            
            {/* Background Image / Ambient Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-neutral-950/90 to-neutral-900/60 z-0" />
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700 z-0"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80')` }}
            />

            {/* Top Floating Glass Badges */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Rachel · Lead AI Interviewer
              </div>

              <div className="bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90">
                🎙️ Audio Stream Active
              </div>
            </div>

            {/* Middle Audio Waveform Visualization Preview */}
            <div className="relative z-10 py-10 space-y-4">
              <div className="flex items-center justify-center gap-1.5 h-16">
                {[40, 75, 30, 95, 60, 85, 45, 100, 70, 50, 90, 65, 35, 80, 55].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${height * 0.4}%`, `${height}%`, `${height * 0.4}%`] }}
                    transition={{ repeat: Infinity, duration: 1.2 + (i % 5) * 0.2, ease: "easeInOut" }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-emerald-400 to-lime-300"
                  />
                ))}
              </div>

              <p className="text-center text-xs font-medium text-neutral-300 tracking-wide uppercase">
                "Explain how garbage collection handles circular references in Node.js"
              </p>
            </div>

            {/* Bottom Card Footer Pill */}
            <div className="relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-lg border border-white/20 p-3 px-5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  94%
                </div>
                <div>
                  <div className="text-xs font-bold text-white">3 Sessions Evaluated</div>
                  <div className="text-[11px] text-neutral-400">FAANG Readiness Candidate</div>
                </div>
              </div>
              
              <Link 
                href="/setup" 
                className="px-4 py-1.5 rounded-full bg-white text-charcoal font-bold text-xs hover:bg-neutral-100 transition-all flex items-center gap-1.5"
              >
                Join Studio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Right Hero Content Card (5 Cols) */}
          <div className="lg:col-span-5 bg-cream/60 border border-neutral-200/80 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal leading-snug">
                Elevate Preparation Process with AI
              </h2>

              <p className="text-neutral-600 text-sm leading-relaxed font-medium">
                Experience the future of interview readiness with Mockly AI. Featuring real-time speech-to-text dictation, live audio waveform feedback, candidate readiness scorecards, and interactive STAR framework guidance.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/60 space-y-1">
                  <div className="text-xl font-black text-charcoal">98.4%</div>
                  <div className="text-xs text-neutral-500 font-semibold">AI Grading Accuracy</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/60 space-y-1">
                  <div className="text-xl font-black text-charcoal">&lt; 2s</div>
                  <div className="text-xs text-neutral-500 font-semibold">Real-Time Evaluation</div>
                </div>
              </div>
            </div>

            {/* CTA Pill Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-neutral-200/60">
              <Link 
                href="/practice" 
                className="flex-1 px-6 py-3 rounded-full border border-neutral-300 bg-white font-bold text-sm text-charcoal hover:bg-neutral-50 text-center transition-all shadow-sm"
              >
                Practice Hub
              </Link>

              <Link 
                href="/setup" 
                className="flex-1 px-6 py-3 rounded-full bg-charcoal text-white font-bold text-sm hover:bg-neutral-800 text-center transition-all shadow-md flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </section>


      {/* ═════════════════════════════════════════════════════════════
         NUMBERED FEATURE SHOWCASE SECTION (`_ Feature` - Dribbble Layout)
         ═════════════════════════════════════════════════════════════ */}
      <section id="features" className="bg-white rounded-[40px] shadow-xl p-6 sm:p-12 space-y-8 border border-white">
        
        {/* Section Label */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <span className="font-display font-bold text-sm uppercase tracking-wider text-neutral-500">
            _ Feature
          </span>

          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
            {activeTabIdx + 1} / {featureTabs.length}
          </div>
        </div>

        {/* Feature Tab Selection Header Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-neutral-100 pb-6">
          {featureTabs.map((tab, idx) => {
            const isActive = idx === activeTabIdx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabIdx(idx)}
                className={`py-3 px-4 rounded-2xl text-left font-bold text-sm transition-all flex items-center justify-between ${
                  isActive 
                    ? 'bg-charcoal text-white shadow-md' 
                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-lime-400" />}
              </button>
            );
          })}
        </div>

        {/* Tab Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Tab Details & Arrow Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                {currentTab.id} Candidate Capability
              </span>

              <h3 className="font-display font-black text-3xl sm:text-4xl text-charcoal leading-tight">
                {currentTab.title}
              </h3>

              <p className="text-neutral-600 text-sm leading-relaxed font-medium">
                {currentTab.subtitle}
              </p>
            </div>

            {/* Bullets */}
            <div className="space-y-2.5 pt-2">
              {currentTab.bullets.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs font-semibold text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Arrow Navigation Controls (Exact Dribbble `← →` Style) */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handlePrevTab}
                className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center text-charcoal hover:bg-neutral-100 transition-all font-bold"
                aria-label="Previous Feature"
              >
                ←
              </button>
              <button
                onClick={handleNextTab}
                className="w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-neutral-800 transition-all font-bold shadow-md"
                aria-label="Next Feature"
              >
                →
              </button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Mock Widget Frame */}
          <div className="lg:col-span-7 bg-neutral-100 rounded-[32px] p-6 sm:p-8 border border-neutral-200/80 relative overflow-hidden flex items-center justify-center min-h-[380px]">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* Mock Card Preview based on tab */}
                {currentTab.previewType === 'voice' && (
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-neutral-200 space-y-6 max-w-md mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Mic className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-charcoal">Voice Studio Active</div>
                          <div className="text-[11px] text-neutral-400">Speech Recognition Engine</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs">
                        Recording...
                      </span>
                    </div>

                    {/* Notification Phone Frame Widget (Inspired by Dribbble mock) */}
                    <div className="bg-neutral-900 text-white rounded-2xl p-4 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span>Next Interview in 15 Min!</span>
                        <span>10.30 AM → 11.30 AM</span>
                      </div>
                      <div className="text-sm font-bold">Blake Dexter · Senior Engineering Role</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-lime-400" />
                        </div>
                        <span className="text-[10px] font-bold text-lime-400">Ready</span>
                      </div>
                    </div>

                    {/* Waveform Bar */}
                    <div className="flex items-center justify-center gap-1 h-8">
                      {[30, 60, 90, 45, 100, 70, 40, 85, 55, 95].map((h, i) => (
                        <div key={i} className="w-1 bg-charcoal rounded-full" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                )}

                {currentTab.previewType === 'star' && (
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-neutral-200 space-y-4 max-w-md mx-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <span className="text-xs font-bold text-charcoal">STAR Framework Advice</span>
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs">Behavioral</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="font-bold text-charcoal">S · Situation</div>
                        <div className="text-neutral-500 text-[11px] mt-1">Set background & problem context</div>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="font-bold text-charcoal">T · Task</div>
                        <div className="text-neutral-500 text-[11px] mt-1">Define your explicit goal</div>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="font-bold text-charcoal">A · Action</div>
                        <div className="text-neutral-500 text-[11px] mt-1">Steps you took to resolve</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                        <div className="font-bold">R · Result</div>
                        <div className="text-emerald-700 text-[11px] mt-1">Quantifiable impact & metric</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab.previewType === 'scorecard' && (
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-neutral-200 space-y-5 max-w-md mx-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-neutral-400 uppercase">Readiness Metric</div>
                        <div className="text-xl font-black text-charcoal">FAANG Candidate</div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-charcoal text-lime-400 font-black text-lg flex items-center justify-center">
                        92%
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Technical Depth</span>
                          <span>95/100</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="w-[95%] h-full bg-charcoal" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>STAR Answer Structure</span>
                          <span>88/100</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="w-[88%] h-full bg-emerald-500" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Articulation & Clarity</span>
                          <span>93/100</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="w-[93%] h-full bg-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab.previewType === 'roadmap' && (
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-neutral-200 space-y-4 max-w-md mx-auto">
                    <div className="text-xs font-bold text-charcoal border-b border-neutral-100 pb-3 flex items-center justify-between">
                      <span>Structured CS Curriculum</span>
                      <span className="text-emerald-600 font-bold">4 / 6 Completed</span>
                    </div>
                    <div className="space-y-2">
                      {['DSA & Complexity', 'OOPs Principles', 'DBMS & SQL Indexing', 'System Design'].map((step, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl text-xs font-bold">
                          <span className="text-charcoal">{idx + 1}. {step}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">Passed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </section>


      {/* ═════════════════════════════════════════════════════════════
         PRACTICE HUB & INSIGHTS GRID (`_ Insights` - Dribbble Layout)
         ═════════════════════════════════════════════════════════════ */}
      <section id="insights" className="bg-white rounded-[40px] shadow-xl p-6 sm:p-12 space-y-8 border border-white">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-100 pb-6">
          <div className="space-y-2 max-w-2xl">
            <span className="font-display font-bold text-sm uppercase tracking-wider text-neutral-500">
              _ Blogs & Practice Modules
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal leading-tight">
              Learn From Industry Experts With Our Curated Interview Prep Sets.
            </h2>
          </div>

          <Link 
            href="/practice" 
            className="px-5 py-2.5 rounded-full border border-neutral-300 font-bold text-xs text-charcoal hover:bg-neutral-100 transition-all self-start sm:self-auto flex items-center gap-1.5"
          >
            View all modules →
          </Link>
        </div>

        {/* 3-Column Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="group relative bg-neutral-900 rounded-[28px] overflow-hidden min-h-[360px] flex flex-col justify-end p-6 text-white shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white">
                System Design
              </span>
              <h3 className="font-display font-bold text-xl leading-snug">
                Create a Positive Candidate & Architect Experience in System Design
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-neutral-900 rounded-[28px] overflow-hidden min-h-[360px] flex flex-col justify-end p-6 text-white shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white">
                Resume & ATS
              </span>
              <h3 className="font-display font-bold text-xl leading-snug">
                Hiring Through ATS Integration & Skill Keyword Extraction
              </h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-neutral-900 rounded-[28px] overflow-hidden min-h-[360px] flex flex-col justify-end p-6 text-white shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white">
                Behavioral STAR
              </span>
              <h3 className="font-display font-bold text-xl leading-snug">
                How Candidates and AI Interviewers Can Collaborate Seamlessly
              </h3>
            </div>
          </div>

        </div>

      </section>


      {/* ═════════════════════════════════════════════════════════════
         TESTIMONIAL SPOTLIGHT (`01` Index - Dribbble Layout)
         ═════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="bg-white rounded-[40px] shadow-xl p-6 sm:p-12 space-y-8 border border-white">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Large Index & Image */}
          <div className="lg:col-span-5 relative space-y-4">
            <div className="font-display font-black text-7xl sm:text-8xl text-neutral-200 leading-none">
              {currentTestimonial.id}
            </div>

            <div className="w-full h-80 rounded-[32px] overflow-hidden border border-neutral-200 relative shadow-md">
              <img 
                src={currentTestimonial.avatar} 
                alt={currentTestimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Quote Content & Controls */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="font-display font-black text-2xl sm:text-4xl text-charcoal leading-snug">
                "{currentTestimonial.quote}"
              </h3>

              <div>
                <div className="font-bold text-base text-charcoal">{currentTestimonial.name}</div>
                <div className="text-sm text-neutral-500 font-medium">{currentTestimonial.role}</div>
              </div>
            </div>

            {/* Back / Next Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePrevTestimonial}
                className="px-6 py-2.5 rounded-full border border-neutral-300 font-bold text-sm text-charcoal hover:bg-neutral-100 transition-all"
              >
                Back
              </button>

              <button
                onClick={handleNextTestimonial}
                className="px-6 py-2.5 rounded-full bg-charcoal text-white font-bold text-sm hover:bg-neutral-800 transition-all shadow-md"
              >
                Next
              </button>
            </div>
          </div>

        </div>

      </section>


      {/* ═════════════════════════════════════════════════════════════
         EDITORIAL FAQ ACCORDION SECTION
         ═════════════════════════════════════════════════════════════ */}
      <section id="faq" className="bg-white rounded-[40px] shadow-xl p-6 sm:p-12 space-y-8 border border-white">
        
        <div className="space-y-2 border-b border-neutral-100 pb-6">
          <span className="font-display font-bold text-sm uppercase tracking-wider text-neutral-500">
            _ Frequently Asked Questions
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal">
            Got Questions? We've Got Answers.
          </h2>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx}
                className="border-b border-neutral-100 pb-4 transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left py-3 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display font-black text-lg text-neutral-300 group-hover:text-charcoal transition-colors">
                      {faq.num}
                    </span>
                    <span className="font-display font-bold text-lg sm:text-xl text-charcoal">
                      {faq.q}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-charcoal group-hover:bg-neutral-100 transition-all">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-10 text-neutral-600 text-sm leading-relaxed font-medium pt-2 pb-2"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </section>

      {/* Footer CTA Strip */}
      <footer className="bg-charcoal text-white rounded-[40px] p-8 sm:p-12 text-center space-y-6">
        <h2 className="font-display font-black text-3xl sm:text-5xl max-w-2xl mx-auto">
          Ready to Ace Your Next AI Interview?
        </h2>
        <p className="text-neutral-400 text-sm max-w-xl mx-auto font-medium">
          Start practicing now with real-time speech dictation, STAR structure hints, and multi-metric AI evaluations.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link 
            href="/setup" 
            className="px-8 py-3.5 rounded-full bg-lime-400 text-charcoal font-black text-sm hover:bg-lime-300 transition-all shadow-lg flex items-center gap-2"
          >
            Start Free Practice <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-6 border-t border-neutral-800 text-xs text-neutral-500 font-semibold">
          © {new Date().getFullYear()} Mockly AI Inc. All rights reserved. Designed with NexHR Dribbble Aesthetic.
        </div>
      </footer>

    </div>
  );
}
