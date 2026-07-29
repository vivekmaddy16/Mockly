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

  // ─── Forgot Password View ──────────────────────────────
  if (view === 'forgot') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in" onClick={onClose}>
        <div className="relative w-full max-w-md modal-card p-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5 transition">
            <X className="w-5 h-5" />
          </button>

          <button onClick={() => { setView('login'); setError(''); }} className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </button>

          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Lock className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white">Forgot Password?</h2>
            <p className="text-sm text-neutral-400 mt-1">Enter your email and we&apos;ll send you a reset link</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-dark"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-signin mt-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Forgot Password Sent View ─────────────────────────
  if (view === 'forgot-sent') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in" onClick={onClose}>
        <div className="relative w-full max-w-md modal-card p-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5 transition">
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white">Check Your Email</h2>
            <p className="text-sm text-neutral-400 mt-2">{successMsg || 'If an account exists with that email, a reset link has been sent.'}</p>
            <p className="text-xs text-neutral-500 mt-4">The link expires in 10 minutes</p>
          </div>

          <button onClick={() => { setView('login'); setError(''); }} className="btn-signin mt-2">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ─── Verification Sent View ────────────────────────────
  if (view === 'verification-sent') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in" onClick={onClose}>
        <div className="relative w-full max-w-md modal-card p-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5 transition">
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Mail className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white">Verify Your Email</h2>
            <p className="text-sm text-neutral-400 mt-2">{successMsg || 'We\'ve sent a verification link to your email.'}</p>
            <p className="text-xs text-neutral-500 mt-4">Check your inbox and click the link to activate your account</p>
          </div>

          <button onClick={onClose} className="btn-signin mt-2">
            Got it!
          </button>
        </div>
      </div>
    );
  }

  // ─── Login / SignUp View ───────────────────────────────
  const isSignUp = view === 'signup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-md modal-card p-8 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <span className="text-2xl font-black text-dark-bg">M</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            {isSignUp ? 'Join Mockly to start your interview prep' : 'Sign in to continue your interview prep journey'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-5">
          <button className="btn-social btn-social-google">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button className="btn-social btn-social-github">
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="divider-text mb-5">Or continue with email</div>

        {/* Form */}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-1.5">Full Name</label>
              <div className="relative">
                <svg className="w-4.5 h-4.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="input-dark"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-dark"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-neutral-300">Password</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => { setView('forgot'); setError(''); }}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? 'Min 8 chars, uppercase, number, special' : 'Enter your password'}
                className="input-dark pr-10"
                required
                minLength={isSignUp ? 8 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isSignUp && (
              <p className="text-xs text-neutral-500 mt-1">Must contain uppercase, lowercase, number & special character</p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-signin mt-2">
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <p className="text-center text-sm text-neutral-400 mt-5">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setView(isSignUp ? 'login' : 'signup'); setError(''); }}
            className="font-bold text-white hover:text-brand-400 underline underline-offset-2 transition"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};
