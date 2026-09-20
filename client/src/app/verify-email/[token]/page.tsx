'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verify = async () => {
      try {
        const msg = await verifyEmail(token);
        setMessage(msg);
        setStatus('success');
      } catch (err: any) {
        setMessage(err.message || 'Verification failed');
        setStatus('error');
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="card-cream max-w-md w-full mx-auto text-center p-8 shadow-xl">
        {status === 'loading' && (
          <div className="py-8 space-y-4">
            <Loader2 className="w-12 h-12 text-forest-ink animate-spin mx-auto mb-4" />
            <h1 className="font-garamond text-3xl font-normal text-vast-ink">Verifying Your Email...</h1>
            <p className="text-sm text-vast-ink/75">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-forest-ink text-lumen-cream flex items-center justify-center shadow-lg mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="font-garamond text-3xl font-normal text-vast-ink">Email Verified! 🎉</h1>
            <p className="text-sm font-normal text-vast-ink/75">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary-cta w-full mt-4"
            >
              Go to Mockly <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-md mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="font-garamond text-3xl font-normal text-vast-ink">Verification Failed</h1>
            <p className="text-sm font-normal text-vast-ink/75">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="btn-secondary-outlined w-full mt-4"
            >
              Go to Home <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
