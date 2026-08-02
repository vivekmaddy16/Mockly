'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Shield, Cpu, BookOpen, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full px-4 sm:px-8 mt-12">
      <div className="max-w-7xl mx-auto space-y-8 rounded-[36px] border border-white/70 bg-white/80 p-6 sm:p-8 shadow-[0_20px_60px_rgba(27,30,22,0.06)] backdrop-blur-xl">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-charcoal text-cream flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <div className="font-display font-black text-xl tracking-tight text-charcoal flex items-center gap-0.5">
                <span>Mockly</span>
                <span className="text-coral">.ai</span>
              </div>
            </Link>
            <p className="text-xs font-medium text-charcoal/70 leading-relaxed">
              AI-powered technical & behavioral interview simulator tailored to your target job description and resume.
            </p>
          </div>

          {/* Interview Prep */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-coral" /> Interview Prep
            </h4>
            <ul className="space-y-2 text-xs font-bold text-charcoal/70">
              <li><Link href="/setup" className="hover:text-charcoal transition">AI Mock Interview</Link></li>
              <li><Link href="/practice" className="hover:text-charcoal transition">Topic Practice Hub</Link></li>
              <li><Link href="/dashboard" className="hover:text-charcoal transition">Candidate Readiness Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-coral" /> CS Topics
            </h4>
            <ul className="space-y-2 text-xs font-bold text-charcoal/70">
              <li><Link href="/practice" className="hover:text-charcoal transition">Data Structures & Algorithms</Link></li>
              <li><Link href="/practice" className="hover:text-charcoal transition">System Design & Architecture</Link></li>
              <li><Link href="/practice" className="hover:text-charcoal transition">DBMS & Operating Systems</Link></li>
            </ul>
          </div>

          {/* Features & Specs */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-coral" /> Security & Cloud
            </h4>
            <ul className="space-y-2 text-xs font-bold text-charcoal/70">
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-coral shrink-0" />
                Built for candidates & engineers
              </li>
              <li>Secure Cloud Storage via MongoDB</li>
              <li>JWT Authentication & Refresh Tokens</li>
              <li>Speech-to-Text & Real-time Evaluation</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-charcoal/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-charcoal/60">
            © {new Date().getFullYear()} Mockly.ai — AI-Powered Interview Preparation System
          </p>
        </div>
      </div>
    </footer>
  );
};
