'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlayCircle, BookOpen, BarChart3, Menu, X, Mic, User } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <header className="sticky top-4 z-50 w-full px-4 sm:px-8 mb-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between rounded-full border-2 border-vast-ink bg-lumen-cream px-4 sm:px-6 py-2.5 shadow-none transition-all">
          
          {/* Logo — Mockly Brand Wispr Flow Style */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-vast-ink text-lumen-cream flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4 text-lavender-whisper" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-garamond text-2xl font-normal tracking-tight text-vast-ink">Mockly</span>
              <span className="font-figtree text-[11px] font-semibold uppercase tracking-wider bg-forest-ink text-lumen-cream px-2 py-0.5 rounded-full">
                AI
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-vast-ink text-lumen-cream font-semibold'
                      : 'text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button — Lavender Whisper CTA */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lumen-cream border-2 border-vast-ink text-sm font-medium text-vast-ink hover:bg-lumen-stone transition"
              >
                <div className="w-6 h-6 rounded-full bg-vast-ink text-lumen-cream flex items-center justify-center font-semibold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate">{user.name}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-sm font-medium text-vast-ink hover:underline"
                >
                  Log in
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                  className="btn-primary-cta-pill"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full border-2 border-vast-ink bg-lumen-cream flex items-center justify-center text-vast-ink"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-[24px] border-2 border-vast-ink bg-lumen-cream p-4 space-y-2 shadow-none animate-fade-in max-w-[1200px] mx-auto">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-vast-ink hover:bg-lumen-stone/50"
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-2 border-t-2 border-vast-ink/10 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsProfileModalOpen(true); }}
                  className="w-full py-2.5 rounded-xl bg-vast-ink text-lumen-cream font-medium text-sm text-center"
                >
                  My Profile ({user.name})
                </button>
              ) : (
                <div className="w-full grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setAuthMode('login'); setIsAuthModalOpen(true); }}
                    className="py-2.5 rounded-xl border-2 border-vast-ink text-sm font-medium text-vast-ink text-center"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setAuthMode('register'); setIsAuthModalOpen(true); }}
                    className="py-2.5 rounded-xl bg-lavender-whisper border-2 border-vast-ink text-vast-ink text-sm font-semibold text-center"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};
