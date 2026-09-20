'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setStatus('error');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters');
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const msg = await resetPassword(token, password);
      setMessage(msg);
      setStatus('success');
    } catch (err: any) {
      setMessage(err.message || 'Password reset failed');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="card-cream max-w-md w-full mx-auto p-8 shadow-xl">
        {status === 'success' ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-forest-ink text-lumen-cream flex items-center justify-center shadow-lg mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="font-garamond text-3xl font-normal text-vast-ink">Password Reset Successful! 🔐</h1>
            <p className="text-sm font-normal text-vast-ink/75">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary-cta w-full mt-4"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6 space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-forest-ink text-lumen-cream flex items-center justify-center shadow-md mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="font-garamond text-3xl font-normal text-vast-ink">Set New Password</h1>
              <p className="text-xs font-normal text-vast-ink/70">Choose a strong password for your Mockly account</p>
            </div>

            {status === 'error' && message && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-red-700">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-vast-ink uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-vast-ink/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setStatus('form'); }}
                    placeholder="Min 8 chars, uppercase, number, special"
                    className="input-castrio pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vast-ink/50 hover:text-vast-ink transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-vast-ink/60 mt-1">Must contain uppercase, lowercase, number & special character</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-vast-ink uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-vast-ink/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setStatus('form'); }}
                    placeholder="Re-enter your password"
                    className="input-castrio pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-cta w-full mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Reset Password <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
