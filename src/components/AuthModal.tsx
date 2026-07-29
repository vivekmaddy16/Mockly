'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

type AuthView = 'login' | 'register' | 'forgot' | 'forgot-sent' | 'verification-sent';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, forgotPassword } = useAuth();
  const [view, setView] = useState<AuthView>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetFields = () => {
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!name.trim()) {
        setError('Please provide your name');
        setIsLoading(false);
        return;
      }
      const result = await register(name, email, password);
      if (result?.message) {
        setSuccessMsg(result.message);
        setView('verification-sent');
      } else {
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const msg = await forgotPassword(email);
      setSuccessMsg(msg);
      setView('forgot-sent');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Forgot Password View ──────────────────────────────
  if (view === 'forgot') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
        <div className="relative w-full max-w-md modal-card p-6 sm:p-8 space-y-5 shadow-2xl">
          <button onClick={onClose} className="absolute top-5 right-5 text-neutral-400 hover:text-white transition p-1 rounded-full hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>

          <button onClick={() => { setView('login'); resetFields(); }} className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </button>

          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
            <p className="text-sm text-neutral-400 mt-1">Enter your email for a reset link</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="input-dark" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-yellow w-full py-3.5 flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Success Views ─────────────────────────────────────
  if (view === 'forgot-sent' || view === 'verification-sent') {
    const isForgot = view === 'forgot-sent';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
        <div className="relative w-full max-w-md modal-card p-6 sm:p-8 space-y-5 shadow-2xl text-center">
          <button onClick={onClose} className="absolute top-5 right-5 text-neutral-400 hover:text-white transition p-1 rounded-full hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>

          <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
            isForgot
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/20'
              : 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-500/20'
          }`}>
            {isForgot ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Mail className="w-6 h-6 text-white" />}
          </div>

          <h2 className="text-xl font-bold text-white">{isForgot ? 'Check Your Email' : 'Verify Your Email'}</h2>
          <p className="text-sm text-neutral-400">{successMsg || (isForgot ? 'Reset link sent if account exists.' : 'Verification link sent to your email.')}</p>
          <p className="text-xs text-neutral-500">{isForgot ? 'Link expires in 10 minutes' : 'Click the link in your email to activate'}</p>

          <button onClick={() => { isForgot ? setView('login') : onClose(); resetFields(); }} className="btn-yellow w-full py-3 text-sm font-bold">
            {isForgot ? 'Back to Sign In' : 'Got it!'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Login / Register View ─────────────────────────────
  const isRegister = view === 'register';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="relative w-full max-w-md modal-card p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 text-neutral-400 hover:text-white transition p-1 rounded-full hover:bg-neutral-800">
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-4 border-b border-neutral-800 pb-4">
          <button
            onClick={() => { setView('login'); resetFields(); }}
            className={`text-lg font-bold transition ${view === 'login' ? 'text-white border-b-2 border-brand-400 -mb-[17px] pb-4' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setView('register'); resetFields(); }}
            className={`text-lg font-bold transition ${view === 'register' ? 'text-white border-b-2 border-brand-400 -mb-[17px] pb-4' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Johnson" className="input-dark" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="input-dark" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-neutral-300">Password</label>
              {!isRegister && (
                <button type="button" onClick={() => { setView('forgot'); resetFields(); }} className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Min 8 chars with Aa1@' : '••••••••'}
                className="input-dark pr-10"
                minLength={isRegister ? 8 : undefined}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isRegister && (
              <p className="text-xs text-neutral-500 mt-1">Uppercase, lowercase, number & special character required</p>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="btn-yellow w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>{isRegister ? 'Create Free Account' : 'Sign In to Mockly'} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Secure authentication with JWT token rotation
          </p>
        </div>
      </div>
    </div>
  );
};
