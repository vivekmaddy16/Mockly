'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, X, Github, ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'login' | 'signup' | 'forgot' | 'forgot-sent' | 'verification-sent';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register, forgotPassword } = useAuth();

  const [view, setView] = useState<ModalView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setShowPassword(false);
      setError('');
      setSuccessMsg('');
      setView('login');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await register(name, email, password);
      if (result?.message) {
        setSuccessMsg(result.message);
        setView('verification-sent');
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const msg = await forgotPassword(email);
      setSuccessMsg(msg);
      setView('forgot-sent');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignUp = view === 'signup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-md modal-card-castrio p-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal">
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-charcoal text-cream font-display font-black text-2xl flex items-center justify-center shadow-lg">
            M
          </div>
        </div>

        <div className="text-center mb-6 space-y-1">
          <h2 className="font-display font-black text-2xl text-charcoal">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs font-bold text-charcoal/60">
            {isSignUp ? 'Join Mockly to start your interview prep' : 'Sign in to continue your interview journey'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-bold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-extrabold text-charcoal mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="input-castrio" required />
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-charcoal mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-castrio" required />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold text-charcoal">Password</label>
              {!isSignUp && (
                <button type="button" onClick={() => setView('forgot')} className="text-xs font-black text-coral hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-castrio pr-10"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/50 hover:text-charcoal">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 rounded-full bg-charcoal text-cream font-bold text-sm hover:bg-charcoal-light transition shadow-xl">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs font-bold text-charcoal/70 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setView(isSignUp ? 'login' : 'signup')} className="font-black text-charcoal underline">
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};
