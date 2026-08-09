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
    }, 1000);
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vast-ink/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {view === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md modal-wispr p-6 sm:p-8 min-h-[480px] max-h-[90vh] overflow-y-auto flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-lumen-stone text-vast-ink z-30">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <button onClick={() => { setView('login'); resetFields(); }} className="flex items-center gap-1.5 text-xs font-semibold text-vast-ink/70 hover:text-vast-ink transition">
                  <ArrowLeft className="w-4 h-4" /> Back to sign in
                </button>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-vast-ink text-lumen-cream flex items-center justify-center">
                    <Lock className="w-5 h-5 text-lavender-whisper" />
                  </div>
                  <h2 className="font-garamond text-3xl font-normal text-vast-ink">Reset Password</h2>
                  <p className="text-xs text-vast-ink/60 font-medium">Enter your registered email for a reset link</p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-ember-glow/20 border-2 border-vast-ink text-vast-ink text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleForgotPassword} className="flex-1 flex flex-col justify-end gap-6 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-vast-ink mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-vast-ink/50 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="input-wispr pl-11" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary-cta w-full py-3 text-sm">
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
              className="relative w-full max-w-md modal-wispr p-8 text-center h-[480px] flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-lumen-stone text-vast-ink z-30">
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                <div className="w-14 h-14 rounded-full bg-forest-ink text-lumen-cream flex items-center justify-center">
                  {view === 'forgot-sent' ? <CheckCircle2 className="w-7 h-7 text-lavender-whisper" /> : <Mail className="w-7 h-7 text-lumen-cream" />}
                </div>

                <div className="space-y-2">
                  <h2 className="font-garamond text-3xl font-normal text-vast-ink">{view === 'forgot-sent' ? 'Check Your Email' : 'Verify Your Email'}</h2>
                  <p className="text-xs font-medium text-vast-ink/70">{successMsg || (view === 'forgot-sent' ? 'Reset link sent if account exists.' : 'Verification link sent to your email.')}</p>
                </div>
              </div>

              <button onClick={() => { view === 'forgot-sent' ? setView('login') : onClose(); resetFields(); }} className="btn-primary-cta w-full py-3 text-sm">
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
              className="relative w-full max-w-md modal-wispr p-6 sm:p-8 min-h-[480px] max-h-[90vh] overflow-y-auto flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-lumen-stone text-vast-ink z-30">
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="relative w-[280px] mx-auto flex items-center bg-lumen-cream border-2 border-vast-ink rounded-full p-[3px] select-none">
                  <button
                    type="button"
                    onClick={() => { setView('login'); resetFields(); }}
                    className={`relative flex-1 py-2 text-center text-xs font-semibold rounded-full transition-colors duration-300 ${
                      view === 'login' ? 'text-lumen-cream' : 'text-vast-ink/70 hover:text-vast-ink'
                    }`}
                  >
                    {view === 'login' && (
                      <motion.div
                        layoutId="modalPillBg"
                        className="absolute inset-0 bg-vast-ink rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setView('register'); resetFields(); }}
                    className={`relative flex-1 py-2 text-center text-xs font-semibold rounded-full transition-colors duration-300 ${
                      view === 'register' ? 'text-lumen-cream' : 'text-vast-ink/70 hover:text-vast-ink'
                    }`}
                  >
                    {view === 'register' && (
                      <motion.div
                        layoutId="modalPillBg"
                        className="absolute inset-0 bg-vast-ink rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">Create Account</span>
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-ember-glow/20 border-2 border-vast-ink text-vast-ink text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <form onSubmit={isRegister ? handleRegister : handleLogin} className="flex-1 flex flex-col justify-between mt-4 gap-4">
                <div className="space-y-3">
                  {isRegister && (
                    <div>
                      <label className="block text-xs font-semibold text-vast-ink mb-1">Full Name</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-vast-ink/50 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Johnson" className="input-wispr pl-11 py-2.5 text-sm" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-vast-ink mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-vast-ink/50 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="input-wispr pl-11 py-2.5 text-sm" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-vast-ink">Password</label>
                      {!isRegister && (
                        <button type="button" onClick={() => { setView('forgot'); resetFields(); }} className="text-xs font-semibold text-vast-ink hover:underline">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-vast-ink/50 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isRegister ? 'Min 8 chars' : '••••••••'}
                        className="input-wispr pl-11 pr-10 py-2.5 text-sm"
                        minLength={isRegister ? 8 : undefined}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-vast-ink/50 hover:text-vast-ink">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Human Verification */}
                <div 
                  onClick={handleVerify}
                  className={`w-full h-12 rounded-xl border-2 border-vast-ink flex items-center justify-between px-3 cursor-pointer select-none transition-all ${
                    isVerified 
                      ? 'bg-forest-ink text-lumen-cream' 
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      {isVerifying ? (
                        <Loader2 className="w-4 h-4 animate-spin text-vast-ink" />
                      ) : isVerified ? (
                        <Check className="w-4 h-4 text-lumen-cream" />
                      ) : (
                        <div className="w-4 h-4 rounded border-2 border-vast-ink" />
                      )}
                    </div>
                    <span className="text-xs font-medium">
                      {isVerifying ? 'Verifying...' : isVerified ? 'Human Verified' : 'Click to verify human'}
                    </span>
                  </div>
                  <ShieldCheck className="w-4 h-4 opacity-70" />
                </div>

                <div className="space-y-2">
                  <button 
                    type="submit" 
                    disabled={isLoading || !isVerified} 
                    className={`btn-primary-cta w-full py-3 text-sm ${
                      (!isVerified || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      <>{isRegister ? 'Create Free Account' : 'Sign In to Mockly'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

