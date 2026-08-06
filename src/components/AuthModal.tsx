'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2, ArrowLeft, Loader2, ShieldCheck, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Human verification states
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView(initialMode);
      setError('');
      setSuccessMsg('');
      setIsVerified(false);
      setIsVerifying(false);
    }
  }, [isOpen, initialMode]);

  const resetFields = () => {
    setError('');
    setSuccessMsg('');
    setIsVerified(false);
    setIsVerifying(false);
  };

  const handleVerify = () => {
    if (isVerified || isVerifying) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1200);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      setError('Please verify you are a human first');
      return;
    }
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
    if (!isVerified) {
      setError('Please verify you are a human first');
      return;
    }
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

  const isRegister = view === 'register';

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={onClose}
        >
          {view === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md modal-card-castrio p-6 sm:p-8 shadow-2xl min-h-[480px] max-h-[90vh] overflow-y-auto flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal z-30">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
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
              </div>

              <form onSubmit={handleForgotPassword} className="flex-1 flex flex-col justify-end gap-6 mt-4">
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
            </motion.div>
          )}

          {(view === 'forgot-sent' || view === 'verification-sent') && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md modal-card-castrio p-8 shadow-2xl text-center h-[540px] flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal z-30">
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-charcoal text-cream flex items-center justify-center shadow-lg">
                  {view === 'forgot-sent' ? <CheckCircle2 className="w-8 h-8 text-mint-light" /> : <Mail className="w-8 h-8 text-cream" />}
                </div>

                <div className="space-y-2">
                  <h2 className="font-display font-black text-2xl text-charcoal">{view === 'forgot-sent' ? 'Check Your Email' : 'Verify Your Email'}</h2>
                  <p className="text-xs font-bold text-charcoal/70">{successMsg || (view === 'forgot-sent' ? 'Reset link sent if account exists.' : 'Verification link sent to your email.')}</p>
                </div>
              </div>

              <button onClick={() => { view === 'forgot-sent' ? setView('login') : onClose(); resetFields(); }} className="w-full py-3.5 rounded-full bg-charcoal text-cream font-bold text-sm">
                {view === 'forgot-sent' ? 'Back to Sign In' : 'Got it!'}
              </button>
            </motion.div>
          )}

          {(view === 'login' || view === 'register') && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md modal-card-castrio p-6 sm:p-8 shadow-2xl min-h-[480px] max-h-[90vh] overflow-y-auto flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal z-30">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="relative w-[280px] mx-auto flex items-center bg-white border border-charcoal/10 rounded-full p-[3px] shadow-sm select-none">
                  <button
                    type="button"
                    onClick={() => { setView('login'); resetFields(); }}
                    className={`relative flex-1 py-2.5 text-center font-display text-xs font-black rounded-full transition-colors duration-300 ${
                      view === 'login' ? 'text-white' : 'text-charcoal/60 hover:text-charcoal'
                    }`}
                  >
                    {view === 'login' && (
                      <motion.div
                        layoutId="modalPillBg"
                        className="absolute inset-0 bg-charcoal rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setView('register'); resetFields(); }}
                    className={`relative flex-1 py-2.5 text-center font-display text-xs font-black rounded-full transition-colors duration-300 ${
                      view === 'register' ? 'text-white' : 'text-charcoal/60 hover:text-charcoal'
                    }`}
                  >
                    {view === 'register' && (
                      <motion.div
                        layoutId="modalPillBg"
                        className="absolute inset-0 bg-charcoal rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">Create Account</span>
                  </button>
                </div>

                {error && (
                  <div className="p-3.5 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <form onSubmit={isRegister ? handleRegister : handleLogin} className="flex-1 flex flex-col justify-between mt-4">
                <div className="space-y-3">
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
                </div>

                {/* Human Verification (mockShield Turnstile Style) */}
                <div 
                  onClick={handleVerify}
                  className={`w-full h-14 rounded-2xl border flex items-center justify-between px-4 cursor-pointer select-none transition-all duration-300 ${
                    isVerified 
                      ? 'bg-emerald-50/30 border-emerald-500/20 text-emerald-800 shadow-sm' 
                      : 'bg-white border-charcoal/10 hover:border-charcoal/20 text-charcoal hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-6 h-6">
                      {isVerifying ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-coral" />
                      ) : isVerified ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -15 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20"
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-charcoal/20 bg-cream/10 hover:border-charcoal/40 transition-colors duration-200" />
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-extrabold text-charcoal/90 leading-tight">
                        {isVerifying 
                          ? 'Running security check...' 
                          : isVerified 
                            ? 'Verification Successful' 
                            : 'Verify you are human'
                        }
                      </span>
                      <span className="text-[9px] font-bold text-charcoal/40 leading-none mt-0.5">
                        {isVerifying 
                          ? 'Checking browser parameters' 
                          : isVerified 
                            ? 'Secure connection initialized' 
                            : 'Click to start secure session'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end opacity-60">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-charcoal/60" />
                      <span className="text-[9px] font-black tracking-wider uppercase font-display text-charcoal/80">mockShield</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-charcoal/30 leading-none select-none">Privacy • Terms</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    type="submit" 
                    disabled={isLoading || !isVerified} 
                    className={`w-full py-3.5 rounded-full font-bold text-sm transition-all duration-300 shadow-xl ${
                      (!isVerified || isLoading) 
                        ? 'bg-charcoal/40 text-cream/60 cursor-not-allowed shadow-none' 
                        : 'bg-charcoal text-cream hover:bg-charcoal-light cursor-pointer'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      <>{isRegister ? 'Create Free Account' : 'Sign In to Mockly'}</>
                    )}
                  </button>

                  <div className="text-center text-xs font-bold text-charcoal/60">
                    <p className="flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Secure authentication with JWT token rotation
                    </p>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
