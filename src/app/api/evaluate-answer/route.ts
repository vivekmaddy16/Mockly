import { NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, userAnswer, targetRole } = body;

    if (!question || !userAnswer) {
      return NextResponse.json({ error: 'question and userAnswer are required' }, { status: 400 });
    }

    const evaluation = await evaluateAnswer(question, userAnswer, targetRole || 'Software Engineer');

    return NextResponse.json(evaluation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
