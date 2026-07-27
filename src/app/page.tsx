'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Code2,
  Briefcase,
  ArrowRight,
  FileText,
  Bot,
  Target,
  BookOpen,
  BarChart3,
  Mic,
  ChevronDown,
  ChevronUp,
  Users,
  Award,
  Brain,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Zap,
  MessageSquare,
  TrendingUp,
  Shield,
} from 'lucide-react';

const faqs = [
  {
    q: 'How does the AI mock interview work?',
    a: 'Upload your resume and target Job Description. Our Gemini AI engine extracts your skills, generates personalized technical & behavioral questions matching the JD, and evaluates your answers in real-time across structure, technical accuracy, and communication clarity.',
  },
  {
    q: 'Do I need a Gemini API key?',
    a: 'No! Mockly includes a high-fidelity built-in AI evaluation engine that works without any API key. However, for the best experience with live Gemini-powered question generation and evaluation, you can optionally configure your free Google Gemini API key.',
  },
  {
    q: 'What topics does the Practice Hub cover?',
    a: 'The Practice Hub covers Data Structures & Algorithms (Arrays, Trees, Graphs, DP), OOPs (Polymorphism, Abstraction, Inheritance), DBMS (ACID, Indexing, Normalization), Operating Systems (Processes, Threads, Deadlocks), and Computer Networks (TCP/UDP, HTTP, DNS).',
  },
  {
    q: 'Can I practice with voice / speech?',
    a: 'Yes! Mockly supports Speech-to-Text (STT) for dictating your answers using your microphone, and Text-to-Speech (TTS) to have the AI interviewer read questions aloud — simulating a real verbal interview experience.',
  },
  {
    q: 'Is my data saved?',
    a: 'All your interview sessions, scores, and progress are saved locally in your browser using LocalStorage. No data is sent to any server. Your privacy is fully maintained.',
  },
];

export default function HomePage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const features = [
    {
      icon: FileText,
      iconClass: 'icon-box-blue',
      cardClass: 'card-gradient-blue',
      title: 'Resume & JD Parsing',
      description:
        'Upload your resume and target Job Description. AI extracts key skills, seniority requirements, and generates custom interview questions tailored to your profile.',
    },
    {
      icon: Bot,
      iconClass: 'icon-box-yellow',
      cardClass: 'card-gradient-yellow',
      title: 'AI Interview Simulator',
      description:
        'Interactive interview room with AI persona. Text and voice-driven Q&A, dynamic follow-ups, code snippets, and real-time hints from the AI interviewer.',
    },
    {
      icon: Target,
      iconClass: 'icon-box-green',
      cardClass: 'card-gradient-green',
      title: 'Multi-Dimensional Grading',
      description:
        'Instant evaluation across Structure, Technical Correctness, Communication Clarity, and STAR method alignment. Detailed model answer comparisons included.',
    },
    {
      icon: BookOpen,
      iconClass: 'icon-box-purple',
      cardClass: 'card-gradient-purple',
      title: 'CS Topic Practice Hub',
      description:
        'Master core fundamentals: DSA, OOPs, DBMS, Operating Systems, Computer Networks, and System Design with interactive coding exercises and AI grading.',
    },
    {
      icon: BarChart3,
      iconClass: 'icon-box-teal',
      cardClass: 'card-gradient-teal',
      title: 'Progress Dashboard',
      description:
        'Visualize your interview score trends, radar competency matrix, weak area alerts, and searchable session history with detailed performance reports.',
    },
    {
      icon: Mic,
      iconClass: 'icon-box-rose',
      cardClass: 'card-gradient-rose',
      title: 'Voice & Audio Mode',
      description:
        'Practice speaking answers aloud with built-in Speech-to-Text dictation and Text-to-Speech question readouts. Simulate real verbal interview pressure.',
    },
  ];

  const whyCards = [
    {
      icon: Brain,
      iconClass: 'icon-box-blue',
      title: 'Gemini AI Engine',
      description: 'Powered by Google Gemini 1.5/2.5 Flash for intelligent question generation and deep answer evaluation with contextual understanding.',
    },
    {
      icon: Shield,
      iconClass: 'icon-box-green',
      title: 'Zero Setup Required',
      description: 'No sign-up, no payment, no API key needed. Start practicing immediately with our built-in AI evaluation simulator. Completely free.',
    },
    {
      icon: MessageSquare,
      iconClass: 'icon-box-yellow',
      title: 'Personalized Feedback',
      description: 'Every answer gets detailed feedback: key strengths, areas to improve, missed requirements, and an exemplary model answer for comparison.',
    },
    {
      icon: TrendingUp,
      iconClass: 'icon-box-purple',
      title: 'Track Your Growth',
      description: 'Monitor your interview readiness score over time. Identify weak topics, track improvements, and focus study efforts where they matter most.',
    },
  ];

  return (
    <div className="page-glow relative">
      <div className="relative z-10 space-y-24 py-6">
        
        {/* ════════ HERO SECTION ════════ */}
        <section className="text-center max-w-4xl mx-auto pt-8 space-y-8 animate-fade-in">
          {/* Subtitle pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-300 text-sm">
            Your ultimate roadmap to interview success
          </div>

          {/* College → Coding → Career Flow */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 py-6">
            {/* College */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-center">
                <GraduationCap className="w-10 h-10 sm:w-14 sm:h-14 text-blue-400" />
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-white">College</span>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-blue-500 to-brand-500"></div>
              <ArrowRight className="w-5 h-5 text-brand-400 -ml-1" />
            </div>

            {/* Interview (center, larger) */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-3xl border-2 border-brand-500/40 bg-brand-500/5 flex items-center justify-center shadow-lg shadow-brand-500/10">
                <Code2 className="w-12 h-12 sm:w-16 sm:h-16 text-brand-400" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-gradient-gold">Interview</span>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-brand-500 to-emerald-500"></div>
              <ArrowRight className="w-5 h-5 text-emerald-400 -ml-1" />
            </div>

            {/* Career */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
                <Briefcase className="w-10 h-10 sm:w-14 sm:h-14 text-emerald-400" />
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-white">Career</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Master in-demand interview skills through AI-powered mock interviews,
            structured practice, and expert-level feedback. Build the bridge to your dream tech career.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/setup" className="btn-yellow text-sm px-8 py-3.5 flex items-center gap-2 shadow-lg shadow-brand-500/20">
              <Zap className="w-4 h-4" />
              Start Mock Interview
            </Link>
            <Link
              href="/practice"
              className="px-8 py-3.5 rounded-full text-sm font-semibold text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Explore Practice Hub
            </Link>
          </div>
        </section>

        {/* ════════ LEVEL UP SECTION ════════ */}
        <section className="text-center max-w-6xl mx-auto space-y-12 animate-slide-up">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-gold">
              Level up your Interview Game
            </h2>
            <p className="text-base text-neutral-400 max-w-xl mx-auto">
              Everything you need to go from preparing your first answer to acing real technical interviews.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className={`${feat.cardClass} rounded-2xl p-7 space-y-5 transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className={`icon-box ${feat.iconClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════ STATS SECTION ════════ */}
        <section className="max-w-4xl mx-auto">
          <div className="card-dark rounded-3xl overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-900">
              {[
                { num: '12+', label: 'CS Topics Covered' },
                { num: '50+', label: 'Practice Questions' },
                { num: '3', label: 'Interview Modes' },
                { num: '100%', label: 'Free & Private' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-number">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ WHY MOCKLY SECTION ════════ */}
        <section className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-gold">
              Why Mockly
            </h2>
            <p className="text-base text-neutral-400 max-w-xl mx-auto">
              We provide the ultimate AI-powered interview preparation ecosystem designed specifically for engineering students and developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="card-dark rounded-2xl p-7 space-y-4">
                  <div className={`icon-box ${card.iconClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════ DEMO PREVIEW CARD ════════ */}
        <section className="max-w-5xl mx-auto">
          <div className="card-gradient-yellow rounded-3xl p-8 sm:p-10 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="icon-box icon-box-yellow">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Live AI Interview Room Preview</h3>
                  <p className="text-xs text-neutral-500">Simulating question & real-time evaluation</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Readiness Score: 88%
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-black/40 border border-neutral-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-brand-400 tracking-widest">
                  Interviewer Prompt (System Architecture)
                </span>
                <p className="text-base font-semibold text-neutral-100">
                  &quot;How would you scale a Next.js / Node.js app to handle 100k concurrent WebSocket connections while maintaining low memory overhead?&quot;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/15 text-neutral-200 space-y-2 font-mono text-xs">
                <span className="text-[10px] uppercase font-bold text-brand-300 tracking-widest font-sans">
                  Candidate Response & AI Breakdown
                </span>
                <p className="font-sans text-sm">
                  &quot;I would decouple WebSocket connections into a dedicated Node cluster using Redis Pub/Sub for cross-node event broadcasting...&quot;
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-sans">
                  <span className="text-emerald-400 font-bold">✓ Technical: 90%</span>
                  <span className="text-blue-400 font-bold">✓ Structure: 85%</span>
                  <span className="text-purple-400 font-bold">✓ Model Answer Comparison</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ FAQ SECTION ════════ */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-gold">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-neutral-400">
              Everything you need to know about Mockly
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  {openFaqIdx === idx ? (
                    <ChevronUp className="w-4 h-4 text-brand-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {openFaqIdx === idx && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ════════ FINAL CTA ════════ */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <div className="card-dark rounded-3xl p-10 sm:p-14 space-y-6 border border-brand-500/15">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-base text-neutral-400 max-w-lg mx-auto">
              Start a personalized AI mock interview in under 30 seconds. No account needed.
            </p>
            <Link href="/setup" className="btn-yellow text-sm px-8 py-3.5 inline-flex items-center gap-2 shadow-lg shadow-brand-500/20">
              <PlayCircle className="w-5 h-5" />
              Launch AI Mock Interview Now
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
