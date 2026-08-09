'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResultsView } from '@/components/ResultsView';
import { InterviewSession } from '@/types';
import { getSessionById } from '@/lib/storage';
import { DEMO_INITIAL_SESSION } from '@/lib/mockData';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthBlocker } from '@/components/AuthBlocker';

export default function InterviewResultsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (id) {
      const found = getSessionById(id);
      if (found) {
        setSession(found);
      } else {
        setSession(DEMO_INITIAL_SESSION);
        setIsDemo(true);
      }
    }
  }, [id]);

  // Authentication Gate
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthBlocker
        title="Mock Interview Scorecard Locked"
        description="You must be signed in to view mock interview results and feedback. Sign in or register below to access your scores."
      />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {isDemo && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2 max-w-5xl mx-auto animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Session not found — showing <strong>demo results</strong> for preview. <a href="/setup" className="underline underline-offset-2 hover:text-amber-300">Create a real interview →</a></span>
        </div>
      )}
      <ResultsView session={session} />
    </>
  );
}
