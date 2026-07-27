'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResultsView } from '@/components/ResultsView';
import { InterviewSession } from '@/types';
import { getSessionById } from '@/lib/storage';
import { DEMO_INITIAL_SESSION } from '@/lib/mockData';

export default function InterviewResultsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [session, setSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    if (id) {
      const found = getSessionById(id);
      if (found) {
        setSession(found);
      } else {
        setSession(DEMO_INITIAL_SESSION);
      }
    }
  }, [id]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <ResultsView session={session} />;
}
