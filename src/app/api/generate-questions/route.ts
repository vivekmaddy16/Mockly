import { NextResponse } from 'next/server';
import { generateInterviewQuestions } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetRole, experienceLevel, resumeText, jobDescriptionText, questionCount, difficultyMode } = body;

    if (!targetRole) {
      return NextResponse.json({ error: 'targetRole is required' }, { status: 400 });
    }

    const result = await generateInterviewQuestions(
      targetRole,
      experienceLevel || 'Mid-Level (2-4 yrs)',
      resumeText || '',
      jobDescriptionText || '',
      questionCount || 3,
      difficultyMode || 'Medium'
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
