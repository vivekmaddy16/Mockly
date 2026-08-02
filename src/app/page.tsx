'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Play, ArrowRight, ArrowUpRight, Sparkles, ChevronDown, ChevronUp, 
  Brain, FileText, Bot, Target, BookOpen, BarChart3, Zap, GraduationCap, 
  Code2, Briefcase, Shield, MessageSquare, TrendingUp, CheckCircle2, 
  Volume2, Award, Users, Star, Layers, Activity, RefreshCw, Check, 
  Cpu, Flame, Sliders, PlayCircle, Terminal, HelpCircle, UserCheck, Scale
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════
// DATA CONFIGURATIONS
// ════════════════════════════════════════════════════════════════════

const HERO_METRICS = [
  { label: 'Evaluation Speed', value: '< 1.8s', subText: 'Real-time feedback' },
  { label: 'Scoring Accuracy', value: '98.6%', subText: 'STAR framework aligned' },
  { label: 'Interviews Completed', value: '25,000+', subText: 'Across top tech roles' },
  { label: 'Candidate Offer Rate', value: '3.4x', subText: 'Higher interview pass rate' },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Upload Resume & Target Job Description',
    subtitle: 'Our Gemini AI engine parses key skills, tech stack prerequisites, and domain expectations to tailor custom technical & behavioral prompts.',
    badge: 'Smart Parsing',
    icon: FileText,
    gradient: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-500',
    details: ['Resume keyword mapping', 'JD requirement weighting', 'Custom difficulty scaling']
  },
  {
    step: '02',
    title: 'Live Voice & AI Technical Studio',
    subtitle: 'Answer questions via microphone or text. Receive real-time speech dictation, STAR structure drawer hints, and AI question readouts.',
    badge: 'Voice & Text',
    icon: Mic,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    details: ['Real-time audio visualizer', 'STAR answer hints drawer', 'Speech-to-text dictation']
  },
  {
    step: '03',
    title: 'Executive Performance Scorecard',
    subtitle: 'Get multi-dimensional scoring across Technical Depth, STAR Answer Structure, and Articulation Clarity with golden AI answer comparisons.',
    badge: 'Instant Grading',
    icon: BarChart3,
    gradient: 'from-cyan-500/20 to-blue-500/10',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
    details: ['FAANG readiness score', 'Side-by-side golden answers', 'Radar domain mastery chart']
  }
];

const FEATURE_TABS = [
  {
    id: 'voice',
    number: '01',
    tabLabel: 'Voice AI Studio',
    title: 'Real-Time Voice Dictation & AI Audio Persona',
    description: 'Speak your answers naturally using microphone dictation with live waveform visualizers. The AI interviewer reads questions aloud with natural cadence.',
    badge: 'Interactive Audio',
    bullets: [
      'Speech-to-Text dictation with live soundwave spectrum',
      'Pulsing AI interviewer avatar during question readout',
      'Instant STAR hints drawer during active recording'
    ],
    previewData: {
      interviewer: 'Rachel · Lead Tech Recruiter',
      status: 'Listening...',
      question: 'How do you handle database index degradation in high-throughput microservices?',
      waveHeights: [35, 65, 95, 40, 80, 100, 60, 85, 30, 70, 90, 50, 75, 45, 80]
    }
  },
  {
    id: 'resume',
    number: '02',
    tabLabel: 'Resume Matcher',
    title: 'Targeted Resume & JD Requirement Matcher',
    description: 'Paste any job posting and upload your resume. Mockly synthesizes questions specifically aligned with missing requirements or highlighted strengths.',
    badge: 'Skill Extraction',
    bullets: [
      'Parses technical stack, frameworks, and experience level',
      'Highlights missing keyword gaps from target JD',
      'Generates targeted scenario-based interview questions'
    ],
    previewData: {
      role: 'Senior Backend Engineer',
      matchScore: '94% Match',
      detectedSkills: ['Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'System Design'],
      missingSkills: ['Kubernetes Operators', 'gRPC']
    }
  },
  {
    id: 'star',
    number: '03',
    tabLabel: 'STAR Drawer',
    title: 'Structured STAR Behavioral Drawer',
    description: 'Fumble no more during situational questions. Access live guidance for Situation, Task, Action, and Result directly during your recording.',
    badge: 'Behavioral Framework',
    bullets: [
      'Collapsible slide-over drawer with real-time prompt hints',
      'Structured answer templates for Amazon, Google & Meta style behavioral rounds',
      'Side-by-side golden model answer comparisons'
    ],
    previewData: {
      situation: 'Conflict with lead architect on caching strategy',
      task: 'Deliver low-latency API response without code churn',
      action: 'Benchmarked Redis vs Memcached and presented data metrics',
      result: 'Achieved 42% latency reduction & unanimous team signoff'
    }
  },
  {
    id: 'scorecard',
    number: '04',
    tabLabel: 'AI Analytics',
    title: 'Executive Multi-Metric Candidate Scorecard',
    description: 'Receive objective breakdown scores across Technical Depth, STAR Structure, and Articulation Clarity, paired with actionable recommendations.',
    badge: 'Executive Analytics',
    bullets: [
      'FAANG readiness gauge with percentile benchmarks',
      'Specific actionable feedback on missing code edge-cases',
      'Interactive radar graph for CS domain mastery'
    ],
    previewData: {
      readiness: 'FAANG Ready (92%)',
      techDepth: 95,
      starStructure: 88,
      articulation: 93,
      overallGrade: 'S Tier'
    }
  },
  {
    id: 'roadmap',
    number: '05',
    tabLabel: 'CS Roadmap',
    title: 'Structured Computer Science Practice Roadmap',
    description: 'Step-by-step milestone nodes covering CS fundamentals and System Design, tracking your progress from beginner to FAANG-ready engineer.',
    badge: 'Curriculum Tree',
    bullets: [
      'Interactive milestone nodes connected to topic quizzes',
      'Curated reading guides and dynamic question banks',
      'Automated topic streak and progress tracking'
    ],
    previewData: {
      progress: '4 of 5 Modules Cleared',
      modules: [
        { name: 'Data Structures & Algorithms', status: 'Mastered (98%)' },
        { name: 'Object-Oriented Programming (OOPs)', status: 'Mastered (95%)' },
        { name: 'Database Systems & SQL', status: 'Mastered (90%)' },
        { name: 'Operating Systems & Concurrency', status: 'Mastered (88%)' },
        { name: 'Distributed System Design', status: 'In Progress (72%)' }
      ]
    }
  }
];

const PRACTICE_MODULES = [
  {
    title: 'Data Structures & Algorithms',
    count: '150+ Questions',
    topics: 'Arrays, Trees, Graphs, DP, Binary Search',
    icon: Code2,
    badge: 'Essential',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-500',
    accentBg: 'bg-emerald-500/10'
  },
  {
    title: 'System Design & Architecture',
    count: '45+ Case Studies',
    topics: 'Load Balancing, Microservices, Sharding, Caching',
    icon: Layers,
    badge: 'Senior & Staff',
    gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-500',
    accentBg: 'bg-cyan-500/10'
  },
  {
    title: 'DBMS & SQL Deep Dive',
    count: '65+ Questions',
    topics: 'ACID, B-Tree Indexing, Transactions, Joins',
    icon: Terminal,
    badge: 'Backend Core',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-500',
    accentBg: 'bg-amber-500/10'
  },
  {
    title: 'Operating Systems & Concurrency',
    count: '50+ Questions',
    topics: 'Processes, Threads, Deadlocks, Virtual Memory',
    icon: Cpu,
    badge: 'Core CS',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-500',
    accentBg: 'bg-purple-500/10'
  },
  {
    title: 'Behavioral STAR Rounds',
    count: '40+ Prompts',
    topics: 'Leadership, Conflict Resolution, Prioritization',
    icon: UserCheck,
    badge: 'All Levels',
    gradient: 'from-coral/10 via-coral/5 to-transparent',
    border: 'border-coral/20',
    iconColor: 'text-coral',
    accentBg: 'bg-coral/10'
  },
  {
    title: 'Object-Oriented Design',
    count: '35+ Scenarios',
    topics: 'Polymorphism, SOLID Principles, Design Patterns',
    icon: Scale,
    badge: 'Object Architecture',
    gradient: 'from-teal-500/10 via-teal-500/5 to-transparent',
    border: 'border-teal-500/20',
    iconColor: 'text-teal-500',
    accentBg: 'bg-teal-500/10'
  }
];

const TESTIMONIALS = [
  {
    id: '01',
    quote: "Mockly's real-time voice studio and STAR guidance drawer completely transformed how I structure my answers. I cleared my Google L5 technical rounds with total confidence!",
    name: "Aarav Sharma",
    role: "Senior Software Engineer @ Google",
    metrics: "Score increased from 68% → 96%",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    company: "Google",
    badge: "L5 Tech Offer"
  },
  {
    id: '02',
    quote: "The side-by-side golden model answer comparison gave me instant clarity on missing technical depth in my System Design responses. Absolutely game-changing product!",
    name: "Priya Nair",
    role: "Staff Backend Engineer @ CloudScale",
    metrics: "3 FAANG offers received",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
    company: "Amazon",
    badge: "Senior Offer"
  },
  {
    id: '03',
    quote: "Resume & JD matching helped me practice exact questions asked in my interview. The multi-metric analytics identified my weak spots in concurrency before the actual interview.",
    name: "Rohan Verma",
    role: "Distributed Systems Architect @ DataFlow",
    metrics: "100% Readiness achieved",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    company: "Meta",
    badge: "E5 Offer"
  }
];

const FAQS = [
  {
    num: '01',
    q: 'How does the AI mock interview work?',
    a: 'Upload your resume and target Job Description. Our Gemini AI engine extracts your key skills, generates realistic technical & behavioral questions matching the role, and evaluates your spoken or typed answers in real-time across technical depth, structure, and articulation.'
  },
  {
    num: '02',
    q: 'Do I need a custom Gemini API key?',
    a: 'No! Mockly includes a high-fidelity built-in AI evaluation engine ready out of the box. You can also connect your own Google Gemini API key via the settings panel or environment configuration if desired.'
  },
  {
    num: '03',
    q: 'What topics does the Practice Hub cover?',
    a: 'Data Structures & Algorithms (Arrays, Trees, Graphs, DP), OOPs (Polymorphism, Abstraction, Encapsulation), DBMS (ACID, Indexing, Transactions), Operating Systems (Processes, Threads, Deadlocks), and System Design Architecture.'
  },
  {
    num: '04',
    q: 'Can I practice with voice dictation & speech readout?',
    a: 'Yes! Mockly features full real-time Speech-to-Text (STT) for dictating your responses using your microphone, and Text-to-Speech (TTS) so the AI interviewer reads questions aloud naturally.'
  },
  {
    num: '05',
    q: 'Is my interview history and readiness score saved?',
    a: 'Yes! All your mock interview sessions, STAR feedback, scorecards, model answer comparisons, and domain mastery charts are securely stored in your personal account dashboard.'
  }
];

export default function HomePage() {
  const [heroTab, setHeroTab] = useState<'voice' | 'scorecard' | 'star' | 'resume'>('voice');
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const currentFeature = FEATURE_TABS[activeFeatureIdx];
  const currentTestimonial = TESTIMONIALS[activeTestimonialIdx];

  const handleNextFeature = () => {
    setActiveFeatureIdx((prev) => (prev + 1) % FEATURE_TABS.length);
  };

  const handlePrevFeature = () => {
    setActiveFeatureIdx((prev) => (prev - 1 + FEATURE_TABS.length) % FEATURE_TABS.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="space-y-20 pb-16 text-charcoal">
      
      {/* ═════════════════════════════════════════════════════════════
         HERO SECTION — ULTRA LUXURY DARK GLASS STUDIO & LIVE DEMO
         ═════════════════════════════════════════════════════════════ */}
      <section className="relative rounded-[36px] bg-charcoal text-cream overflow-hidden border border-white/10 shadow-2xl p-6 sm:p-10 lg:p-14">
        
        {/* Ambient Gradient Glow Backgrounds */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/40 via-charcoal to-charcoal pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy & Main CTAs */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Live Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-cream shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Gemini AI Voice Studio 2.0 Released</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white">
                Ace Your Next Tech Interview With <span className="bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">Real-Time AI Feedback</span>
              </h1>

              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-normal max-w-xl">
                Practice voice-based technical & behavioral interviews customized to your <strong>resume</strong> and target <strong>job description</strong>. Get real-time speech dictation, STAR framework guidance, and multi-metric scorecards.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link 
                href="/setup" 
                className="px-7 py-4 rounded-full bg-lime-400 text-charcoal font-black text-sm hover:bg-lime-300 transition-all shadow-[0_10px_30px_rgba(197,248,116,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2.5 group"
              >
                <Mic className="w-4 h-4 text-charcoal group-hover:scale-110 transition-transform" />
                <span>Start Mock Interview</span>
                <ArrowRight className="w-4 h-4 text-charcoal group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                href="/practice" 
                className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-cream font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:border-white/30"
              >
                <BookOpen className="w-4 h-4 text-lime-400" />
                <span>Explore Practice Hub</span>
              </Link>
            </div>

            {/* Feature Quick Check Badges */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>Resume & JD Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>Voice Speech-to-Text</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>STAR Behavior Drawer</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Hero Live Studio Simulator */}
          <div className="lg:col-span-6">
            <div className="bg-neutral-900/90 rounded-[28px] border border-white/15 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5 relative">
              
              {/* Studio Top Control Switcher Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-coral/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-mono text-neutral-400">mockly-studio.v2</span>
                </div>

                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 text-[11px] font-bold">
                  <button
                    onClick={() => setHeroTab('voice')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      heroTab === 'voice' ? 'bg-lime-400 text-charcoal shadow-sm' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Voice Mode
                  </button>
                  <button
                    onClick={() => setHeroTab('scorecard')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      heroTab === 'scorecard' ? 'bg-lime-400 text-charcoal shadow-sm' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Scorecard
                  </button>
                  <button
                    onClick={() => setHeroTab('star')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      heroTab === 'star' ? 'bg-lime-400 text-charcoal shadow-sm' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    STAR Hints
                  </button>
                </div>
              </div>

              {/* Dynamic View Content based on Tab */}
              <AnimatePresence mode="wait">
                
                {/* 1. Voice Mode View */}
                {heroTab === 'voice' && (
                  <motion.div 
                    key="voice"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* Interviewer Persona Card */}
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-400 text-charcoal flex items-center justify-center font-bold text-sm shadow-md">
                            R
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-neutral-900 rounded-full" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            Rachel · Lead AI Recruiter
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">Gemini 1.5 Pro</span>
                          </div>
                          <div className="text-[11px] text-neutral-400">Target Role: Senior Systems Engineer</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                        <span>Audio Active</span>
                      </div>
                    </div>

                    {/* AI Question Box */}
                    <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Question #02 · System Architecture
                      </div>
                      <p className="text-sm text-neutral-200 font-medium leading-relaxed">
                        "Explain how garbage collection handles circular references in Node.js V8 engine, and how you prevent memory leaks in production microservices?"
                      </p>
                    </div>

                    {/* Real-time Audio Spectrum Visualizer */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span className="flex items-center gap-1.5 text-lime-400 font-mono text-[11px]">
                          <Mic className="w-3.5 h-3.5 animate-pulse" /> Spoken Answer Dictation
                        </span>
                        <span className="font-mono text-[11px]">01:42 / 03:00</span>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 h-14 bg-black/40 rounded-xl px-4">
                        {[40, 75, 30, 95, 60, 85, 45, 100, 70, 50, 90, 65, 35, 80, 55, 90, 45, 70].map((height, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [`${height * 0.3}%`, `${height}%`, `${height * 0.3}%`] }}
                            transition={{ repeat: Infinity, duration: 1.1 + (i % 4) * 0.2, ease: "easeInOut" }}
                            className="w-1.5 rounded-full bg-gradient-to-t from-emerald-400 to-lime-300"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Scorecard View */}
                {heroTab === 'scorecard' && (
                  <motion.div 
                    key="scorecard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                      <div>
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Candidate Readiness Rating</div>
                        <div className="text-xl font-black text-white">FAANG Candidate Grade</div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-lime-400 text-charcoal font-black text-xl flex items-center justify-center shadow-lg">
                        94%
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-bold mb-1 text-neutral-300">
                          <span>Technical Depth & Accuracy</span>
                          <span className="text-lime-400">95/100</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[95%] h-full bg-lime-400" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1 text-neutral-300">
                          <span>STAR Answer Structure</span>
                          <span className="text-emerald-400">90/100</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[90%] h-full bg-emerald-400" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1 text-neutral-300">
                          <span>Articulation & Clarity</span>
                          <span className="text-cyan-400">92/100</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[92%] h-full bg-cyan-400" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-neutral-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                      <span><strong>Key Strength:</strong> Exceptional explanation of Mark-Sweep GC algorithm and weakmap references.</span>
                    </div>
                  </motion.div>
                )}

                {/* 3. STAR Hints View */}
                {heroTab === 'star' && (
                  <motion.div 
                    key="star"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="font-bold text-lime-400 uppercase tracking-wider text-[11px]">STAR Guidance Drawer</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[10px]">Behavioral & Tech Scenario</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                        <div className="font-bold text-lime-400">S · Situation</div>
                        <div className="text-neutral-300 text-[11px]">Set background & scale of microservice system</div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                        <div className="font-bold text-emerald-400">T · Task</div>
                        <div className="text-neutral-300 text-[11px]">Define memory spike bug & goal</div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                        <div className="font-bold text-cyan-400">A · Action</div>
                        <div className="text-neutral-300 text-[11px]">Profiling heap dumps & introducing WeakMap</div>
                      </div>

                      <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/30 space-y-1">
                        <div className="font-bold text-lime-300">R · Result</div>
                        <div className="text-neutral-200 text-[11px]">45% memory reduction in production</div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Studio Bottom Quick Link */}
              <div className="pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-lime-400" /> Powered by Google Gemini AI
                </span>
                <Link href="/setup" className="text-lime-400 font-bold hover:underline flex items-center gap-1">
                  Launch Studio Session <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* Hero Metrics Strip */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 mt-12 border-t border-white/10">
          {HERO_METRICS.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="font-display font-black text-2xl sm:text-3xl text-lime-400">{stat.value}</div>
              <div className="text-xs font-bold text-white">{stat.label}</div>
              <div className="text-[11px] text-neutral-400 font-medium">{stat.subText}</div>
            </div>
          ))}
        </div>

      </section>


      {/* ═════════════════════════════════════════════════════════════
         HOW IT WORKS — 3-STEP CANDIDATE JOURNEY
         ═════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream border border-charcoal/10 text-xs font-extrabold tracking-widest text-charcoal uppercase">
            <Zap className="w-3.5 h-3.5 text-coral" /> Simplified Workflow
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal leading-tight">
            How Mockly Prepares You For Any Tech Round
          </h2>
          <p className="text-charcoal/70 text-sm font-medium">
            From resume parsing to live voice practice and executive scorecards, get full interview readiness in 3 simple steps.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WORKFLOW_STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.step}
                className="group relative rounded-3xl bg-white border border-charcoal/10 p-7 shadow-[0_10px_30px_rgba(27,30,22,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-4xl text-charcoal/20 group-hover:text-charcoal/40 transition-colors">
                      {step.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl ${step.gradient} border ${step.borderColor} flex items-center justify-center ${step.iconColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-xl text-charcoal group-hover:text-coral transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-charcoal/70 leading-relaxed font-medium">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Details List */}
                <div className="pt-4 border-t border-charcoal/5 space-y-2">
                  {step.details.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-charcoal/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </section>


      {/* ═════════════════════════════════════════════════════════════
         FEATURE SHOWCASE — INTERACTIVE TAB SYSTEM
         ═════════════════════════════════════════════════════════════ */}
      <section id="features" className="space-y-10 rounded-[36px] bg-white border border-charcoal/10 p-6 sm:p-10 shadow-[0_16px_50px_rgba(27,30,22,0.05)]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-charcoal/10 pb-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-coral">
              _ Capability Showcase
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal leading-tight">
              Engineered For High-Stakes Technical & Behavioral Rounds
            </h2>
          </div>

          {/* Navigation Arrow Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevFeature}
              className="w-11 h-11 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:bg-cream transition-all font-bold"
              aria-label="Previous Feature"
            >
              ←
            </button>
            <button
              onClick={handleNextFeature}
              className="w-11 h-11 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-neutral-800 transition-all font-bold shadow-md"
              aria-label="Next Feature"
            >
              →
            </button>
          </div>
        </div>

        {/* Feature Tab Selection Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {FEATURE_TABS.map((tab, idx) => {
            const isActive = idx === activeFeatureIdx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureIdx(idx)}
                className={`py-3 px-4 rounded-2xl text-left font-extrabold text-xs transition-all flex items-center justify-between ${
                  isActive 
                    ? 'bg-charcoal text-white shadow-md' 
                    : 'bg-cream/60 text-charcoal/70 hover:bg-cream hover:text-charcoal'
                }`}
              >
                <span>{tab.tabLabel}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Feature Content Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-4">
          
          {/* Left Column: Descriptions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-coral/10 text-coral font-bold text-xs inline-block">
                {currentFeature.badge}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-charcoal leading-tight">
                {currentFeature.title}
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed font-medium">
                {currentFeature.description}
              </p>
            </div>

            {/* Bullets */}
            <div className="space-y-3 pt-2">
              {currentFeature.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs font-bold text-charcoal">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Quick Action Link */}
            <div className="pt-4">
              <Link 
                href="/setup" 
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-charcoal hover:text-coral transition-colors"
              >
                <span>Test in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Mock Display Frame */}
          <div className="lg:col-span-7 bg-charcoal rounded-3xl p-6 sm:p-8 border border-white/10 text-cream relative overflow-hidden min-h-[380px] flex items-center justify-center shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg mx-auto"
              >
                
                {/* Voice Studio Mock */}
                {currentFeature.id === 'voice' && (
                  <div className="space-y-5 bg-neutral-900 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-400 text-charcoal font-bold flex items-center justify-center text-sm">
                          R
                        </div>
                        <div>
                          <div className="text-xs font-bold">{currentFeature.previewData.interviewer}</div>
                          <div className="text-[11px] text-emerald-400 font-semibold">{currentFeature.previewData.status}</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Live STT</span>
                    </div>

                    <div className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5 font-mono">
                      "{currentFeature.previewData.question}"
                    </div>

                    <div className="flex items-center justify-center gap-1.5 h-12 bg-neutral-950 rounded-xl px-4">
                      {currentFeature.previewData.waveHeights?.map((h, i) => (
                        <div key={i} className="w-1.5 rounded-full bg-gradient-to-t from-emerald-400 to-lime-300" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume Matcher Mock */}
                {currentFeature.id === 'resume' && (
                  <div className="space-y-4 bg-neutral-900 p-6 rounded-2xl border border-white/10 text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <div className="font-bold text-white">{currentFeature.previewData.role}</div>
                        <div className="text-[11px] text-neutral-400">Parsed from JD & Resume PDF</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-lime-400 text-charcoal font-black text-xs">
                        {currentFeature.previewData.matchScore}
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] text-neutral-400 font-bold mb-2 uppercase tracking-wider">Detected Candidate Competencies</div>
                      <div className="flex flex-wrap gap-2">
                        {currentFeature.previewData.detectedSkills?.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-neutral-400 font-bold mb-2 uppercase tracking-wider">Focus Target Gaps</div>
                      <div className="flex flex-wrap gap-2">
                        {currentFeature.previewData.missingSkills?.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-coral/20 text-coral font-semibold text-[11px]">
                            ! {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STAR Drawer Mock */}
                {currentFeature.id === 'star' && (
                  <div className="space-y-3 bg-neutral-900 p-6 rounded-2xl border border-white/10 text-xs">
                    <div className="font-bold text-lime-400 border-b border-white/10 pb-2">
                      STAR Answer Framework Breakdown
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="font-bold text-lime-400">Situation</div>
                        <div className="text-[11px] text-neutral-300 mt-1">{currentFeature.previewData.situation}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="font-bold text-emerald-400">Task</div>
                        <div className="text-[11px] text-neutral-300 mt-1">{currentFeature.previewData.task}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="font-bold text-cyan-400">Action</div>
                        <div className="text-[11px] text-neutral-300 mt-1">{currentFeature.previewData.action}</div>
                      </div>
                      <div className="p-3 bg-lime-400/10 rounded-xl border border-lime-400/30">
                        <div className="font-bold text-lime-300">Result</div>
                        <div className="text-[11px] text-neutral-200 mt-1">{currentFeature.previewData.result}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scorecard Analytics Mock */}
                {currentFeature.id === 'scorecard' && (
                  <div className="space-y-4 bg-neutral-900 p-6 rounded-2xl border border-white/10 text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <div className="text-[11px] text-neutral-400 uppercase font-bold">Overall Rating</div>
                        <div className="text-lg font-black text-white">{currentFeature.previewData.readiness}</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-lime-400 text-charcoal font-black text-base flex items-center justify-center">
                        {currentFeature.previewData.overallGrade}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Technical Depth</span>
                          <span className="text-lime-400">{currentFeature.previewData.techDepth}/100</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[95%] h-full bg-lime-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>STAR Answer Structure</span>
                          <span className="text-emerald-400">{currentFeature.previewData.starStructure}/100</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[88%] h-full bg-emerald-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Articulation</span>
                          <span className="text-cyan-400">{currentFeature.previewData.articulation}/100</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[93%] h-full bg-cyan-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Roadmap Tree Mock */}
                {currentFeature.id === 'roadmap' && (
                  <div className="space-y-3 bg-neutral-900 p-6 rounded-2xl border border-white/10 text-xs">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="font-bold text-white">CS Mastery Progress</span>
                      <span className="text-lime-400 font-bold">{currentFeature.previewData.progress}</span>
                    </div>
                    <div className="space-y-2">
                      {currentFeature.previewData.modules?.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5">
                          <span className="font-semibold">{m.name}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">{m.status}</span>
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
         PRACTICE MODULES CAROUSEL & CARDS
         ═════════════════════════════════════════════════════════════ */}
      <section id="practice" className="space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-charcoal/10 text-xs font-bold text-charcoal uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-coral" /> Practice Modules
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal leading-tight">
              Topic Mastery & CS Curriculum
            </h2>
          </div>

          <Link 
            href="/practice" 
            className="px-6 py-3 rounded-full border border-charcoal/20 font-extrabold text-xs text-charcoal hover:bg-cream transition-all self-start sm:self-auto flex items-center gap-2"
          >
            <span>View All Practice Topics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_MODULES.map((module, idx) => {
            const Icon = module.icon;
            return (
              <Link 
                key={idx}
                href="/practice"
                className={`group rounded-3xl bg-white border ${module.border} p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1 relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} pointer-events-none`} />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${module.accentBg} flex items-center justify-center ${module.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-charcoal text-cream font-bold text-[10px] tracking-wider uppercase">
                      {module.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl text-charcoal group-hover:text-coral transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs font-bold text-neutral-500">
                      {module.count}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-charcoal/10 flex items-center justify-between text-xs">
                  <span className="text-charcoal/70 font-semibold truncate max-w-[200px]">
                    {module.topics}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-charcoal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </section>


      {/* ═════════════════════════════════════════════════════════════
         TESTIMONIALS & SUCCESS STORIES
         ═════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="rounded-[36px] bg-white border border-charcoal/10 p-6 sm:p-10 shadow-[0_16px_50px_rgba(27,30,22,0.05)] space-y-8">
        
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
          <span className="font-display font-bold text-xs uppercase tracking-widest text-coral">
            _ Candidate Success Stories
          </span>

          <div className="flex items-center gap-2 text-xs font-bold text-charcoal/50">
            0{activeTestimonialIdx + 1} / 0{TESTIMONIALS.length}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Avatar & Big Quote Indicator */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-full h-80 rounded-3xl overflow-hidden border border-charcoal/10 shadow-lg">
              <img 
                src={currentTestimonial.avatar} 
                alt={currentTestimonial.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-4 left-4 right-4 text-cream space-y-1">
                <span className="px-3 py-1 rounded-full bg-lime-400 text-charcoal font-black text-xs inline-block">
                  {currentTestimonial.badge}
                </span>
                <div className="font-display font-black text-xl">{currentTestimonial.name}</div>
                <div className="text-xs text-neutral-300 font-medium">{currentTestimonial.role}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Content & Nav Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-charcoal leading-snug">
                "{currentTestimonial.quote}"
              </h3>

              <div className="p-4 rounded-2xl bg-cream border border-charcoal/10 flex items-center justify-between text-xs font-bold text-charcoal">
                <span>Verified Metric Outcome</span>
                <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-black">
                  {currentTestimonial.metrics}
                </span>
              </div>
            </div>

            {/* Prev / Next Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePrevTestimonial}
                className="px-6 py-2.5 rounded-full border border-charcoal/20 font-extrabold text-xs text-charcoal hover:bg-cream transition-all"
              >
                Previous Story
              </button>

              <button
                onClick={handleNextTestimonial}
                className="px-6 py-2.5 rounded-full bg-charcoal text-white font-extrabold text-xs hover:bg-neutral-800 transition-all shadow-md"
              >
                Next Story →
              </button>
            </div>

          </div>

        </div>

      </section>


      {/* ═════════════════════════════════════════════════════════════
         FAQ ACCORDION SECTION
         ═════════════════════════════════════════════════════════════ */}
      <section id="faq" className="space-y-8 max-w-4xl mx-auto">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream border border-charcoal/10 text-xs font-bold text-charcoal uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-coral" /> FAQ
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-white border border-charcoal/10 p-5 shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display font-black text-base text-coral">
                      {faq.num}
                    </span>
                    <span className="font-display font-bold text-base sm:text-lg text-charcoal group-hover:text-coral transition-colors">
                      {faq.q}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal group-hover:bg-cream transition-all shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-9 pr-4 text-charcoal/70 text-xs sm:text-sm leading-relaxed font-medium pt-3"
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


      {/* ═════════════════════════════════════════════════════════════
         BOTTOM CALL TO ACTION BANNER
         ═════════════════════════════════════════════════════════════ */}
      <section className="relative rounded-[36px] bg-charcoal text-cream p-8 sm:p-14 text-center space-y-6 overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-lime-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" /> Start Preparing Today
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl leading-tight">
            Ready to Clear Your Technical Interview?
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base font-medium max-w-lg mx-auto">
            Experience real-time voice speech dictation, STAR structure hints, and multi-metric candidate scorecards with Mockly AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/setup" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-lime-400 text-charcoal font-black text-sm hover:bg-lime-300 transition-all shadow-[0_10px_30px_rgba(197,248,116,0.3)] flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <Mic className="w-4 h-4" />
              <span>Start Free Practice Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-extrabold text-sm hover:bg-white/15 transition-all flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-lime-400" />
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
