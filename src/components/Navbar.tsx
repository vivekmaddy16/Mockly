'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlayCircle, BookOpen, BarChart3, Key, Menu, X, Zap } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { getStoredApiKey } from '@/lib/storage';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkKey = () => {
    setHasApiKey(!!getStoredApiKey());
  };

  useEffect(() => {
    checkKey();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Mock Interview', href: '/setup', icon: PlayCircle },
    { name: 'Topic Practice', href: '/practice', icon: BookOpen },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full py-3 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="navbar-floating px-5 sm:px-6 py-2.5 flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-base font-black text-dark-bg">M</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight">
                  MOCKLY
                </span>
                <span className="text-base font-extrabold tracking-tight text-brand-400 ml-0.5">
                  .AI
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={() => setIsKeyModalOpen(true)}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                API Key
              </button>
            </div>

            {/* Right side Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Get Started CTA — navigates directly to setup */}
              <Link
                href="/setup"
                className="btn-yellow text-xs sm:text-sm px-4 sm:px-5 py-2 inline-flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                Get Started
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="md:hidden w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile Dropdown Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 p-5 modal-card rounded-2xl animate-fade-in space-y-3 shadow-2xl border border-neutral-800">
              <div className="flex flex-col space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                          : 'text-neutral-300 hover:bg-neutral-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-brand-400" />
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsKeyModalOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-neutral-300 hover:bg-neutral-800/50 transition w-full text-left"
                >
                  <Key className="w-4 h-4 text-brand-400" />
                  Gemini API Key Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaved={checkKey}
      />
    </>
  );
};
