'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Shield, BookOpen, Layers, Heart, ArrowRight, 
  CheckCircle2, Mic, BarChart3, Mail, Check, Monitor, Smartphone, Apple, Laptop
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

  const platforms = [
    { name: 'Mac App', icon: Apple },
    { name: 'Windows', icon: Monitor },
    { name: 'Web Studio', icon: Laptop },
    { name: 'iPhone & Mobile', icon: Smartphone },
  ];

  return (
    <footer className="w-full mt-20">
      <div className="bg-vast-ink text-lumen-cream rounded-t-[40px] md:rounded-t-[64px] border-t-2 border-vast-ink p-8 sm:p-14 space-y-12">
        <div className="max-w-[1200px] mx-auto space-y-12">
          
          {/* Platform Selector Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-lumen-stone/10">
            <div className="space-y-1">
              <span className="font-garamond text-2xl text-lumen-cream">Available everywhere</span>
              <p className="text-xs text-fog font-normal">Practice interviews on your desktop, browser, or mobile device.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.name} className="badge-platform">
                    <Icon className="w-4 h-4 text-lumen-cream" />
                    <span>{p.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Newsletter Strip */}
          <div className="card-forest-panel flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <div className="badge-ember text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Weekly Interview Digest
              </div>
              <h3 className="font-garamond text-2xl sm:text-3xl text-lumen-cream font-normal mt-2">
                High-Frequency FAANG & Tech Practice Questions
              </h3>
              <p className="text-sm text-lumen-stone/80 max-w-xl">
                Curated System Design architectures, DSA patterns, and STAR behavioral prompt breakdowns sent weekly.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
              {isSubscribed ? (
                <div className="px-6 py-3 rounded-xl bg-lumen-cream text-vast-ink text-sm font-medium flex items-center gap-2 border-2 border-vast-ink">
                  <Check className="w-4 h-4 text-forest-ink" /> Subscribed successfully!
                </div>
              ) : (
                <>
                  <div className="relative w-full sm:w-72">
                    <Mail className="w-4 h-4 text-vast-ink/50 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="input-wispr pl-11 py-3 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary-cta w-full sm:w-auto py-3 px-6 text-sm shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Main Footer Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-full bg-lumen-cream text-vast-ink flex items-center justify-center font-bold">
                  <Mic className="w-4 h-4 text-forest-ink" />
                </div>
                <div className="font-garamond text-3xl text-lumen-cream">
                  Mockly.ai
                </div>
              </Link>

              <p className="text-sm text-fog leading-relaxed max-w-sm">
                An AI-powered technical & behavioral interview simulator built like an editorial broadsheet. Practice real-time voice speech dictation, STAR answer structure hints, and objective scorecard analytics.
              </p>

              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-lumen-stone/20 text-xs text-fog">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember-glow opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-ember-glow" />
                </span>
                <span>Gemini AI Speech Evaluation Engine Active</span>
              </div>
            </div>

            {/* Column 1: Studio Navigation */}
            <div className="space-y-3">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Studio Navigation
              </h4>
              <ul className="space-y-2 text-sm text-fog">
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
                  <Link href="/reset-password" className="hover:text-lumen-cream transition-colors">
                    Account Recovery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: CS Topics */}
            <div className="space-y-3">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Core CS Topics
              </h4>
              <ul className="space-y-2 text-sm text-fog">
                <li><Link href="/practice" className="hover:text-lumen-cream transition-colors">Data Structures & Algorithms</Link></li>
                <li><Link href="/practice" className="hover:text-lumen-cream transition-colors">Distributed System Design</Link></li>
                <li><Link href="/practice" className="hover:text-lumen-cream transition-colors">DBMS & SQL Indexing</Link></li>
                <li><Link href="/practice" className="hover:text-lumen-cream transition-colors">Operating Systems & Concurrency</Link></li>
                <li><Link href="/practice" className="hover:text-lumen-cream transition-colors">STAR Behavioral Framework</Link></li>
              </ul>
            </div>

            {/* Column 3: Platform Features */}
            <div className="space-y-3">
              <h4 className="font-figtree font-semibold text-xs uppercase tracking-wider text-lavender-whisper">
                Platform Features
              </h4>
              <ul className="space-y-2 text-sm text-fog">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lavender-whisper shrink-0" />
                  Gemini AI Evaluation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lavender-whisper shrink-0" />
                  Real-Time Voice Dictation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lavender-whisper shrink-0" />
                  STAR Structure Hints Drawer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lavender-whisper shrink-0" />
                  Side-by-Side Golden Answers
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-lumen-stone/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fog">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <p>© {new Date().getFullYear()} Mockly.ai Inc. All rights reserved.</p>
              <span>•</span>
              <span className="flex items-center gap-1">
                Built with <Heart className="w-3.5 h-3.5 text-ember-glow fill-ember-glow" /> for software engineers
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge-dark-sq">Next.js 15</span>
              <span className="badge-dark-sq">Tailwind CSS</span>
              <span className="badge-dark-sq">Gemini AI</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
