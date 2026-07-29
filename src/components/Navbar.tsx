'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlayCircle, BookOpen, BarChart3, Key, Menu, X, Mic, User, LogIn, Sparkles } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
import { useAuth } from '@/context/AuthContext';
import { getStoredApiKey } from '@/lib/storage';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkKey = () => {
    setHasApiKey(!!getStoredApiKey());
  };

  useEffect(() => {
    checkKey();
  }, []);

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
      <header className="sticky top-0 z-40 w-full py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="navbar-castrio px-5 sm:px-6 py-3 flex items-center justify-between">
            
            {/* Logo — Castrio Lined Badge + Syne Display Typography */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-full bg-charcoal text-cream flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <div className="font-display font-extrabold text-xl tracking-tight text-charcoal flex items-center gap-1">
                <span>Mockly</span>
                <span className="w-2 h-2 rounded-full bg-coral inline-block" />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-bold transition-colors duration-200 ${
                      isActive
                        ? 'text-charcoal border-b-2 border-charcoal pb-0.5'
                        : 'text-charcoal/70 hover:text-charcoal'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={() => setIsKeyModalOpen(true)}
                className="text-sm font-bold text-charcoal/70 hover:text-charcoal transition-colors"
              >
                API Key
              </button>
            </div>

            {/* Right side Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream border border-charcoal/10 hover:bg-white text-xs font-extrabold text-charcoal transition shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-charcoal text-cream flex items-center justify-center font-bold text-[11px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                    className="text-xs sm:text-sm font-extrabold text-charcoal hover:opacity-80 px-3 py-1.5 transition hidden sm:inline-flex items-center gap-1"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                    className="text-xs font-extrabold text-charcoal bg-white border border-charcoal/10 px-3.5 py-2 rounded-full transition shadow-sm hover:bg-cream"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Castrio Dual-Pill Connected CTA `( 🎙️ ) [ Start Prep ]` */}
              <Link href="/setup" className="btn-dual-pill">
                <div className="icon-badge">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="btn-label hidden sm:inline">Start Prep</span>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="md:hidden w-10 h-10 rounded-full bg-cream border border-charcoal/10 flex items-center justify-center text-charcoal hover:bg-white transition"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile Dropdown Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 p-5 card-cream rounded-[28px] animate-fade-in space-y-2 shadow-2xl border border-white">
              <div className="flex flex-col space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition ${
                        isActive
                          ? 'bg-charcoal text-cream'
                          : 'text-charcoal hover:bg-black/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}

                {!isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold text-charcoal hover:bg-black/5 transition w-full text-left"
                  >
                    <User className="w-4 h-4" />
                    Sign In / Register
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold text-charcoal hover:bg-black/5 transition w-full text-left"
                  >
                    <User className="w-4 h-4" />
                    My Profile ({user?.name})
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsKeyModalOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold text-charcoal hover:bg-black/5 transition w-full text-left"
                >
                  <Key className="w-4 h-4" />
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
