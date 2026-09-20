import { NextResponse } from 'next/server';
import { explainMCQWithAI, generateMCQsForTopic } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, topic, question, userSelectedIndex, difficulty, count } = body;

    if (action === 'explain') {
      if (!topic || !question) {
        return NextResponse.json({ error: 'topic and question are required' }, { status: 400 });
      }
      const coaching = await explainMCQWithAI(topic, question, userSelectedIndex);
      return NextResponse.json(coaching);
    }

    if (action === 'generate') {
      if (!topic) {
        return NextResponse.json({ error: 'topic is required' }, { status: 400 });
      }
      const questions = await generateMCQsForTopic(topic, difficulty || 'Medium', count || 2);
      return NextResponse.json({ questions });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
