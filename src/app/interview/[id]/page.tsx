'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InterviewRoom } from '@/components/InterviewRoom';
import { InterviewSession } from '@/types';
import { fetchSessionByIdAsync, getSessionById } from '@/lib/storage';
import { DEMO_INITIAL_SESSION } from '@/lib/mockData';
import { AlertCircle } from 'lucide-react';

export default function InterviewSessionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (id) {
      // Immediate sync fallback for speed
      const local = getSessionById(id);
      if (local) {
        setSession(local);
        setIsLoading(false);
      }

      // Async cloud fetch from MongoDB / API
      fetchSessionByIdAsync(id).then((found) => {
        if (!isMounted) return;
        if (found) {
          setSession(found);
          setIsDemo(false);
        } else if (!local) {
          setSession(DEMO_INITIAL_SESSION);
          setIsDemo(true);
        }
        setIsLoading(false);
      }).catch(() => {
        if (!isMounted) return;
        if (!local) {
          setSession(DEMO_INITIAL_SESSION);
          setIsDemo(true);
        }
        setIsLoading(false);
      });
    }

    return () => { isMounted = false; };
  }, [id]);

  if (isLoading && !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      {isDemo && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-bold flex items-center gap-2 max-w-5xl mx-auto animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
          <span>Session not found in cloud storage — loading a <strong>demo interview</strong> preview. <a href="/setup" className="underline underline-offset-2 hover:text-amber-800">Create a real interview →</a></span>
        </div>
      )}
      <InterviewRoom session={session} />
    </>
  );
}
