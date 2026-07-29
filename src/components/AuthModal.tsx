'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2, ArrowLeft, Loader2, ShieldCheck, Zap } from 'lucide-react';
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

  // Forgot Password View
  if (view === 'forgot') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
        <div className="relative w-full max-w-md modal-card-castrio p-8 space-y-6 shadow-2xl">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal">
            <X className="w-5 h-5" />
          </button>

          <button onClick={() => { setView('login'); resetFields(); }} className="flex items-center gap-1.5 text-xs font-bold text-charcoal/70 hover:text-charcoal transition">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </button>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-charcoal text-cream flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-display font-black text-2xl text-charcoal">Reset Password</h2>
            <p className="text-xs font-bold text-charcoal/60">Enter your registered email for a reset link</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-charcoal mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="input-castrio" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-charcoal text-cream font-bold text-sm hover:bg-charcoal-light transition shadow-lg">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Success Views
  if (view === 'forgot-sent' || view === 'verification-sent') {
    const isForgot = view === 'forgot-sent';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
        <div className="relative w-full max-w-md modal-card-castrio p-8 space-y-6 shadow-2xl text-center">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal">
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-full bg-charcoal text-cream flex items-center justify-center shadow-lg">
            {isForgot ? <CheckCircle2 className="w-8 h-8 text-mint-light" /> : <Mail className="w-8 h-8 text-cream" />}
          </div>

          <div className="space-y-1">
            <h2 className="font-display font-black text-2xl text-charcoal">{isForgot ? 'Check Your Email' : 'Verify Your Email'}</h2>
            <p className="text-xs font-bold text-charcoal/70">{successMsg || (isForgot ? 'Reset link sent if account exists.' : 'Verification link sent to your email.')}</p>
          </div>

          <button onClick={() => { isForgot ? setView('login') : onClose(); resetFields(); }} className="w-full py-3.5 rounded-full bg-charcoal text-cream font-bold text-sm">
            {isForgot ? 'Back to Sign In' : 'Got it!'}
          </button>
        </div>
      </div>
    );
  }

  // Login / Register View
  const isRegister = view === 'register';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="relative w-full max-w-md modal-card-castrio p-8 space-y-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal">
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-4 border-b border-charcoal/10 pb-4">
          <button
            onClick={() => { setView('login'); resetFields(); }}
            className={`font-display text-lg font-black transition ${view === 'login' ? 'text-charcoal border-b-2 border-charcoal -mb-[17px] pb-4' : 'text-charcoal/40 hover:text-charcoal'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setView('register'); resetFields(); }}
            className={`font-display text-lg font-black transition ${view === 'register' ? 'text-charcoal border-b-2 border-charcoal -mb-[17px] pb-4' : 'text-charcoal/40 hover:text-charcoal'}`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-extrabold text-charcoal mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-charcoal/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Johnson" className="input-castrio" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-charcoal mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="input-castrio" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold text-charcoal">Password</label>
              {!isRegister && (
                <button type="button" onClick={() => { setView('forgot'); resetFields(); }} className="text-xs font-black text-coral hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Min 8 chars with Aa1@' : '••••••••'}
                className="input-castrio pr-10"
                minLength={isRegister ? 8 : undefined}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/50 hover:text-charcoal">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-4 mt-2 rounded-full bg-charcoal text-cream font-bold text-sm hover:bg-charcoal-light transition shadow-xl">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              <>{isRegister ? 'Create Free Account' : 'Sign In to Mockly'}</>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-bold text-charcoal/60">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Secure authentication with JWT token rotation
          </p>
        </div>
      </div>
    </div>
  );
};
