'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mic, ArrowRight, ChevronRight,
  FileText, BookOpen, BarChart3, Zap, 
  Code2, Shield, Award, Users, Layers, Check, 
  Cpu, Terminal
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
  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* ════════════════════════════════════════════════════════════════
         SECTION 1: HERO (Cream Canvas BroadSheet)
         ════════════════════════════════════════════════════════════════ */}
      <section className="text-center pt-8 pb-4 max-w-5xl mx-auto space-y-8">
        

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
         SECTION 2: THREE-STEP WORKFLOW (Cream Broadsheet Layout)
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
         SECTION 3: TOPIC PRACTICE MODULES (Side-by-Side Cards)
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
         SECTION 4: BOTTOM CALL TO ACTION
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
