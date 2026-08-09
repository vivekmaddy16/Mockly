'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Play, ArrowRight, ArrowUpRight, Sparkles, ChevronRight,
  Brain, FileText, Bot, Target, BookOpen, BarChart3, Zap, GraduationCap, 
  Code2, Briefcase, Shield, MessageSquare, TrendingUp, CheckCircle2, 
  Volume2, Award, Users, Star, Layers, Activity, RefreshCw, Check, 
  Cpu, Flame, Sliders, PlayCircle, Terminal, HelpCircle, UserCheck, Scale,
  Apple, Monitor, Laptop, Smartphone
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════
// DATA CONFIGURATIONS
// ════════════════════════════════════════════════════════════════════

const HERO_METRICS = [
  { label: 'Evaluation Speed', value: '< 1.8s', subText: 'Real-time feedback' },
  { label: 'Scoring Accuracy', value: '98.6%', subText: 'STAR framework aligned' },
  { label: 'Interviews Completed', value: '25,000+', subText: 'Across top tech roles' },
  { label: 'Pass Rate Increase', value: '3.4x', subText: 'Higher offer success' },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Upload Resume & Target JD',
    subtitle: 'Our Gemini AI engine parses your key skills, tech stack prerequisites, and domain expectations to tailor custom technical & behavioral questions.',
    badge: 'Smart Parsing',
    icon: FileText,
    details: ['Resume keyword mapping', 'JD requirement weighting', 'Custom difficulty scaling']
  },
  {
    step: '02',
    title: 'Live Voice & Speech Studio',
    subtitle: 'Answer questions using live microphone dictation with real-time waveform visualizers, speech-to-text dictation, and STAR structure hints.',
    badge: 'Voice & Text',
    icon: Mic,
    details: ['Real-time audio visualizer', 'STAR answer hints drawer', 'Speech-to-text dictation']
  },
  {
    step: '03',
    title: 'Executive Scorecard',
    subtitle: 'Get multi-dimensional scoring across Technical Depth, STAR Answer Structure, and Articulation Clarity paired with golden AI answer comparisons.',
    badge: 'Instant Grading',
    icon: BarChart3,
    details: ['FAANG readiness score', 'Side-by-side golden answers', 'Radar domain mastery chart']
  }
];

const FEATURE_TABS = [
  {
    id: 'voice',
    number: '01',
    tabLabel: 'Voice AI Studio',
    title: 'Real-Time Voice Dictation & Audio Persona',
    description: 'Speak your answers naturally using microphone dictation with live waveform visualizers. The AI interviewer reads questions aloud with natural speech cadence.',
    badge: 'Interactive Audio',
    bullets: [
      'Speech-to-Text dictation with live soundwave spectrum',
      'Pulsing AI interviewer avatar during question readout',
      'Instant STAR hints drawer during active recording'
    ],
    previewData: {
      interviewer: 'Rachel · Tech Recruiter AI',
      status: 'Listening...',
      question: 'How do you handle database index degradation in high-throughput microservices?',
    }
  },
  {
    id: 'resume',
    number: '02',
    tabLabel: 'Resume Matcher',
    title: 'Targeted Resume & JD Requirement Synthesizer',
    description: 'Paste any target job description and upload your resume. Mockly synthesizes questions specifically aligned with your missing skills or highlighted strengths.',
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
      'Structured answer templates for Amazon, Google & Meta behavioral rounds',
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
    tabLabel: 'AI Scorecard',
    title: 'Executive Candidate Performance Analytics',
    description: 'Receive objective breakdown scores across Technical Depth, STAR Structure, and Articulation Clarity, paired with actionable improvement advice.',
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
  }
];

const PRACTICE_MODULES = [
  {
    title: 'Data Structures & Algorithms',
    count: '150+ Questions',
    topics: 'Arrays, Trees, Graphs, DP, Binary Search',
    icon: Code2,
    badge: 'Essential',
  },
  {
    title: 'System Design & Architecture',
    count: '45+ Case Studies',
    topics: 'Load Balancing, Microservices, Sharding, Caching',
    icon: Layers,
    badge: 'Senior & Staff',
  },
  {
    title: 'DBMS & SQL Deep Dive',
    count: '65+ Questions',
    topics: 'ACID, B-Tree Indexing, Transactions, Joins',
    icon: Terminal,
    badge: 'Backend Core',
  },
  {
    title: 'Operating Systems & Concurrency',
    count: '50+ Questions',
    topics: 'Processes, Threads, Deadlocks, Memory Management',
    icon: Cpu,
    badge: 'CS Fundamentals',
  },
  {
    title: 'STAR Behavioral Scenarios',
    count: '80+ Situational Prompts',
    topics: 'Leadership, Ambiguity, Conflict, Project Impact',
    icon: Users,
    badge: 'Behavioral',
  },
  {
    title: 'Object-Oriented Design (OOPs)',
    count: '40+ Design Patterns',
    topics: 'SOLID Principles, Design Patterns, Abstraction',
    icon: Shield,
    badge: 'Architecture',
  }
];

export default function HomePage() {
  const [activeTabId, setActiveTabId] = useState('voice');
  const activeTab = FEATURE_TABS.find((t) => t.id === activeTabId) || FEATURE_TABS[0];

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* ════════════════════════════════════════════════════════════════
         SECTION 1: HERO (Cream Canvas BroadSheet)
         ════════════════════════════════════════════════════════════════ */}
      <section className="text-center pt-8 pb-4 max-w-5xl mx-auto space-y-8">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2">
          <div className="badge-teal">
            <Sparkles className="w-4 h-4 text-lavender-whisper" />
            <span>AI-Powered Interview Simulator</span>
          </div>
          <div className="hidden sm:inline-flex waveform-visualizer-pill">
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
          </div>
        </div>

        {/* Display Headline in EB Garamond 400 */}
        <div className="space-y-4">
          <h1 className="font-garamond font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.92] tracking-tight text-vast-ink max-w-4xl mx-auto">
            <span className="text-fog">Ace your next</span>{' '}
            <span className="underline-accent-container">
              technical & behavioral
              <svg className="underline-accent-svg" viewBox="0 0 300 20" fill="none">
                <path d="M5 12 Q 75 2, 150 12 T 295 10" stroke="#f0d7ff" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>{' '}
            interviews.
          </h1>

          <p className="font-figtree font-normal text-lg sm:text-xl text-vast-ink/80 max-w-2xl mx-auto pt-2">
            Mockly simulates real-time FAANG & tech interview rounds customized to your exact resume and target job description. Live speech dictation, STAR hints, and AI scorecards.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/setup" className="btn-primary-cta text-lg px-8 py-4 w-full sm:w-auto">
            <Mic className="w-5 h-5" />
            <span>Start Practice Interview</span>
          </Link>
          <Link href="/practice" className="btn-secondary-outlined text-lg px-8 py-4 w-full sm:w-auto">
            <span>Explore Topic Quizzes</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t-2 border-vast-ink/10">
          {HERO_METRICS.map((m, idx) => (
            <div key={idx} className="p-4 text-left border-l-2 border-vast-ink pl-4">
              <div className="font-garamond text-3xl sm:text-4xl text-vast-ink font-normal">{m.value}</div>
              <div className="font-figtree text-xs font-semibold text-vast-ink mt-0.5">{m.label}</div>
              <div className="font-figtree text-[11px] text-fog">{m.subText}</div>
            </div>
          ))}
        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 2: DARK VELVET CHAMBER (Feature Showcase)
         ════════════════════════════════════════════════════════════════ */}
      <section className="card-dark-chamber space-y-12">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="badge-teal">
              <Bot className="w-4 h-4 text-lavender-whisper" />
              <span>Interactive Feature Suite</span>
            </div>
            <h2 className="font-garamond text-3xl sm:text-5xl text-lumen-cream font-normal leading-[0.95]">
              Built like a high-stakes tech interview room.
            </h2>
          </div>

          {/* Feature Tab Switches */}
          <div className="flex flex-wrap gap-2">
            {FEATURE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                  activeTabId === tab.id
                    ? 'bg-lavender-whisper text-vast-ink border-vast-ink'
                    : 'bg-transparent text-lumen-cream/70 border-lumen-stone/20 hover:text-lumen-cream'
                }`}
              >
                {tab.tabLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-lavender-whisper">
                Module {activeTab.number}
              </span>
              <h3 className="font-garamond text-2xl sm:text-4xl text-lumen-cream font-normal">
                {activeTab.title}
              </h3>
            </div>

            <p className="text-base text-fog leading-relaxed">
              {activeTab.description}
            </p>

            <ul className="space-y-3 pt-2">
              {activeTab.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-lumen-cream">
                  <div className="w-5 h-5 rounded-full bg-forest-ink flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-lumen-cream" />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link href="/setup" className="btn-secondary-outlined-dark">
                <span>Try this feature live</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column Illustration Mockup (Flat Phone / App View) */}
          <div className="lg:col-span-6">
            <div className="bg-lumen-cream text-vast-ink p-6 sm:p-8 rounded-[32px] border-2 border-vast-ink space-y-6">
              
              <div className="flex items-center justify-between border-b-2 border-vast-ink/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-ink text-lumen-cream flex items-center justify-center font-bold">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-figtree font-semibold text-sm">Rachel · Senior AI Evaluator</div>
                    <div className="text-xs text-fog flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-ember-glow" /> Active Interview Session
                    </div>
                  </div>
                </div>
                <div className="badge-dark-sq text-xs">STAR Mode</div>
              </div>

              {/* Question Bubble */}
              <div className="p-4 rounded-2xl bg-lumen-stone/30 border-2 border-vast-ink/10 space-y-2">
                <div className="text-xs font-semibold text-fog uppercase tracking-wider">Question 02 of 05</div>
                <p className="font-garamond text-xl font-normal leading-snug">
                  "How do you handle database index degradation and connection pool saturation in high-throughput microservices?"
                </p>
              </div>

              {/* Speech Waveform Pill */}
              <div className="flex items-center justify-between p-3 rounded-full bg-vast-ink text-lumen-cream">
                <div className="flex items-center gap-3 pl-3">
                  <div className="w-3 h-3 rounded-full bg-ember-glow animate-pulse" />
                  <span className="text-xs font-medium">Mic Active · Dictating answer...</span>
                </div>
                <div className="waveform-visualizer-pill bg-lumen-cream text-vast-ink border-vast-ink">
                  <div className="waveform-bar bg-vast-ink" />
                  <div className="waveform-bar bg-vast-ink" />
                  <div className="waveform-bar bg-vast-ink" />
                  <div className="waveform-bar bg-vast-ink" />
                  <div className="waveform-bar bg-vast-ink" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 3: THREE-STEP WORKFLOW (Cream Broadsheet Layout)
         ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-12 max-w-[1200px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="badge-teal">
            <Zap className="w-4 h-4 text-lavender-whisper" />
            <span>Workflow Engine</span>
          </div>
          <h2 className="font-garamond text-3xl sm:text-5xl font-normal tracking-tight text-vast-ink">
            How Mockly prepares you for offer day.
          </h2>
          <p className="font-figtree text-base text-vast-ink/70">
            A three-stage simulation pipeline designed to transform practice into confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="card-cream flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-garamond text-4xl text-fog font-normal">{step.step}</span>
                    <div className="w-10 h-10 rounded-full bg-forest-ink text-lumen-cream flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-garamond text-2xl font-normal text-vast-ink">
                    {step.title}
                  </h3>

                  <p className="text-sm text-vast-ink/75 leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-vast-ink/10 space-y-2">
                  {step.details.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-vast-ink">
                      <Check className="w-3.5 h-3.5 text-forest-ink shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 4: TOPIC PRACTICE MODULES (Side-by-Side Cards)
         ════════════════════════════════════════════════════════════════ */}
      <section className="card-dark-chamber space-y-12">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="badge-teal">
              <BookOpen className="w-4 h-4 text-lavender-whisper" />
              <span>Targeted Topic Mastery</span>
            </div>
            <h2 className="font-garamond text-3xl sm:text-5xl text-lumen-cream font-normal leading-[0.95]">
              Master key CS domains topic by topic.
            </h2>
          </div>

          <Link href="/practice" className="btn-secondary-outlined-dark shrink-0">
            <span>View All Topics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div key={idx} className="bg-lumen-cream text-vast-ink rounded-3xl p-6 border-2 border-vast-ink flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-forest-ink text-lumen-cream flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="badge-dark-sq text-xs">{mod.badge}</span>
                  </div>

                  <h3 className="font-garamond text-2xl font-normal text-vast-ink pt-2">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-vast-ink/70 font-medium">
                    {mod.topics}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-vast-ink/10">
                  <span className="text-xs font-bold text-vast-ink">{mod.count}</span>
                  <Link href="/practice" className="btn-ghost-link text-xs font-semibold">
                    Practice <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 5: BOTTOM CALL TO ACTION
         ════════════════════════════════════════════════════════════════ */}
      <section className="card-cream text-center p-10 sm:p-16 space-y-8 max-w-[1200px] mx-auto border-2 border-vast-ink">
        
        <div className="badge-teal mx-auto">
          <Award className="w-4 h-4 text-lavender-whisper" />
          <span>Ready to Practice?</span>
        </div>

        <h2 className="font-garamond text-4xl sm:text-6xl text-vast-ink font-normal max-w-3xl mx-auto leading-[0.92]">
          Step into your next interview with complete confidence.
        </h2>

        <p className="font-figtree text-base sm:text-lg text-vast-ink/80 max-w-xl mx-auto">
          No sign-up fee required to get started. Practice your customized technical & STAR interview round right now.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/setup" className="btn-primary-cta text-lg px-8 py-4">
            <Mic className="w-5 h-5" />
            <span>Launch Mock Simulator</span>
          </Link>
          <Link href="/dashboard" className="btn-secondary-outlined text-lg px-8 py-4">
            <span>View Candidate Scorecard</span>
          </Link>
        </div>

      </section>

    </div>
  );
}
