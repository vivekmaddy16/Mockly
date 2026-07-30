'use client';

import React, { useState } from 'react';
import { ShieldAlert, LogIn } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface AuthBlockerProps {
  title?: string;
  description?: string;
}

export const AuthBlocker: React.FC<AuthBlockerProps> = ({
  title = "Authentication Required",
  description = "You must be signed in to access this feature. Please log in or register to continue your preparation."
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto py-16 animate-fade-in">
      <div className="card-cream p-10 sm:p-12 space-y-6 text-center shadow-2xl border border-white">
        <div className="w-20 h-20 rounded-full bg-coral/10 text-coral flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-charcoal">{title}</h2>
          <p className="text-xs font-bold text-charcoal/60 leading-relaxed max-w-sm mx-auto">{description}</p>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn-dual-pill scale-110"
          >
            <div className="icon-badge">
              <LogIn className="w-5 h-5 text-charcoal" />
            </div>
            <span className="btn-label">Sign In / Register</span>
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};
