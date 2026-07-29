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
      <header className="w-full py-4 px-4 sm:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo — Mockly Brand with Castrio Design Style */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-charcoal text-cream flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <div className="font-display font-black text-2xl tracking-tight text-charcoal flex items-center gap-0.5">
              <span>Mockly</span>
              <span className="text-coral">.ai</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-extrabold tracking-tight transition-colors ${
                    isActive ? 'text-charcoal border-b-2 border-charcoal pb-0.5' : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="text-xs font-extrabold tracking-tight text-charcoal/70 hover:text-charcoal transition-colors"
            >
              API Key
            </button>
          </div>

          {/* Right Side Connected Dual Pill `[ Login ] ( Register )` */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-charcoal/10 hover:bg-cream text-xs font-extrabold text-charcoal transition shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-charcoal text-cream flex items-center justify-center font-bold text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </button>
            ) : (
              /* Connected Pill `[ Login ] ( Register )` */
              <div className="btn-connected-pill">
                <button
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="login-btn"
                >
                  Login
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                  className="signup-btn"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-white border border-charcoal/10 flex items-center justify-center text-charcoal"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 modal-card-castrio space-y-2 shadow-2xl animate-fade-in">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 rounded-2xl text-xs font-extrabold text-charcoal hover:bg-black/5"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <ApiKeyModal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} onSaved={checkKey} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};
