'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-900 bg-dark-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-base font-black text-dark-bg">M</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-white">MOCKLY</span>
                <span className="text-base font-extrabold text-brand-400">.AI</span>
              </div>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed">
              AI-powered mock interview simulator. Practice technical & behavioral interviews, get instant feedback, and track your progress.
            </p>
          </div>

          {/* Interview Prep */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Interview Prep</h4>
            <ul className="space-y-2.5">
              <li><Link href="/setup" className="text-sm text-neutral-500 hover:text-brand-400 transition">Mock Interview</Link></li>
              <li><Link href="/practice" className="text-sm text-neutral-500 hover:text-brand-400 transition">Topic Practice</Link></li>
              <li><Link href="/dashboard" className="text-sm text-neutral-500 hover:text-brand-400 transition">Progress Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link href="/practice" className="text-sm text-neutral-500 hover:text-brand-400 transition">DSA Practice</Link></li>
              <li><Link href="/practice" className="text-sm text-neutral-500 hover:text-brand-400 transition">System Design</Link></li>
              <li><Link href="/practice" className="text-sm text-neutral-500 hover:text-brand-400 transition">CS Fundamentals</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-neutral-500">About Us</span></li>
              <li><span className="text-sm text-neutral-500">Contact Us</span></li>
              <li><span className="text-sm text-neutral-500">Privacy Policy</span></li>
              <li><span className="text-sm text-neutral-500">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Mockly.AI — AI-Powered Interview Preparation System
          </p>
          <div className="flex items-center gap-4 text-neutral-600">
            <span className="text-xs">Powered by Google Gemini</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
