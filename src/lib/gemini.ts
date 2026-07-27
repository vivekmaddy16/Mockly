import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, QuestionEvaluation, ExperienceLevel } from '@/types';
import { getStoredApiKey } from './storage';

export const getGeminiClient = () => {
  const customKey = getStoredApiKey();
  const apiKey = customKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.error('Failed to initialize Gemini AI client:', e);
    return null;
  }
};

export const generateInterviewQuestions = async (
  targetRole: string,
  experienceLevel: ExperienceLevel,
  resumeText: string = '',
  jobDescriptionText: string = '',
  questionCount: number = 3
): Promise<{ questions: Question[]; extractedSkills: string[] }> => {
  const genAI = getGeminiClient();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are an expert technical interviewer for top technology companies.
Generate ${questionCount} customized, high-quality interview questions for a candidates interviewing for the role of "${targetRole}" at experience level "${experienceLevel}".

${resumeText ? `Candidate Resume Content:\n${resumeText.slice(0, 1500)}\n` : ''}
${jobDescriptionText ? `Job Description Requirements:\n${jobDescriptionText.slice(0, 1500)}\n` : ''}

Instructions:
1. Include a mix of Technical, Behavioral, and System Architecture/CS questions matching the candidate's skills and the JD.
2. Return ONLY a valid raw JSON object matching the JSON schema below. Do not include markdown code block formatting like \`\`\`json.

JSON Schema:
{
  "extractedSkills": ["Skill1", "Skill2", "Skill3"],
  "questions": [
    {
      "id": "q_1",
      "type": "technical",
      "category": "DSA / Frontend / Backend / System Design",
      "questionText": "Detailed question prompt...",
      "expectedKeyPoints": ["Key point 1", "Key point 2"],
      "difficulty": "Easy"
    }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return {
          questions: parsed.questions,
          extractedSkills: parsed.extractedSkills || ['React', 'TypeScript', 'Node.js', 'System Architecture']
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to intelligent dynamic generator:', err);
    }
  }

  // High Quality Smart Fallback Dynamic Generator
  const extractedSkills = extractSkillsFromText(resumeText + ' ' + jobDescriptionText + ' ' + targetRole);
  
  const generated: Question[] = [];
  
  // 1. Tech Deep Dive
  generated.push({
    id: `gen_q1_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'technical',
    category: extractedSkills[0] || 'Web Architecture',
    questionText: `Given your target role as a ${targetRole} (${experienceLevel}), how would you optimize the performance and memory consumption of a production application utilizing ${extractedSkills.slice(0, 3).join(', ') || 'modern frameworks'} under high request concurrency?`,
    expectedKeyPoints: [
      'Profiling memory leaks and event loop bottlenecks',
      'Caching strategy (Redis / CDN / In-Memory)',
      'Asynchronous non-blocking batch execution',
      'Database indexing and connection pooling'
    ],
    difficulty: 'Medium'
  });

  // 2. Behavioral / Leadership
  generated.push({
    id: `gen_q2_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'behavioral',
    category: 'Behavioral & Problem Solving',
    questionText: `Tell me about a time when you had to balance building a quick solution to meet a tight business deadline versus writing a long-term scalable system. How did you manage technical debt?`,
    expectedKeyPoints: [
      'STAR format (Situation, Task, Action, Result)',
      'Clear trade-off analysis and communication with stakeholders',
      'Documenting and tracking technical debt backlog items',
      'Post-launch refactoring strategy'
    ],
    difficulty: 'Medium'
  });

  // 3. Technical / CS Fundamental or DSA
  if (questionCount >= 3) {
    generated.push({
      id: `gen_q3_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'technical',
      category: 'CS Fundamentals & Reliability',
      questionText: `How do you handle error boundaries, distributed transaction rollbacks, or state recovery when an upstream API service fails in a microservice or multi-tier architecture?`,
      expectedKeyPoints: [
        'Circuit breaker pattern and retry backoff',
        'Idempotency keys and saga transaction pattern',
        'Graceful UX degradation and user notification'
      ],
      difficulty: experienceLevel.includes('Senior') || experienceLevel.includes('Lead') ? 'Hard' : 'Medium'
    });
  }

  return { questions: generated, extractedSkills };
};

export const evaluateAnswer = async (
  question: Question,
  userAnswer: string,
  targetRole: string
): Promise<QuestionEvaluation> => {
  const genAI = getGeminiClient();

  if (genAI && userAnswer.trim().length > 10) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an elite Tech Lead & Senior Interviewer evaluating a candidate's answer for the role of "${targetRole}".

Question Category: ${question.category}
Question: "${question.questionText}"
Expected Key Points: ${question.expectedKeyPoints.join(', ')}

Candidate's Answer:
"${userAnswer}"

Instructions:
Evaluate the answer critically and constructively.
Return ONLY a valid raw JSON object matching the schema below (no markdown code block syntax).

JSON Schema:
{
  "score": 85,
  "structureScore": 80,
  "technicalScore": 90,
  "clarityScore": 85,
  "keyPointsCovered": ["Point 1 covered"],
  "keyPointsMissed": ["Point 2 missed"],
  "feedback": "Constructive 2-3 sentence overview...",
  "positiveHighlights": ["Clear explanation of concept X", "Good use of STAR framework"],
  "areasToImprove": ["Mention time complexity explicitly", "Add error handling details"],
  "modelAnswer": "Comprehensive model answer for comparison..."
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        questionId: question.id,
        userAnswer,
        score: parsed.score || 75,
        structureScore: parsed.structureScore || 75,
        technicalScore: parsed.technicalScore || 75,
        clarityScore: parsed.clarityScore || 80,
        keyPointsCovered: parsed.keyPointsCovered || question.expectedKeyPoints.slice(0, 2),
        keyPointsMissed: parsed.keyPointsMissed || question.expectedKeyPoints.slice(2),
        feedback: parsed.feedback || 'Good structural start. Incorporate more granular technical examples to strengthen your response.',
        positiveHighlights: parsed.positiveHighlights || ['Identified the primary system constraint clearly.', 'Good logical flow.'],
        areasToImprove: parsed.areasToImprove || ['Mention specific Big-O memory bounds.', 'Provide concrete real-world code snippet.'],
        modelAnswer: parsed.modelAnswer || `To answer this question effectively: 1. Briefly define the core problem. 2. Explain your solution using ${question.expectedKeyPoints.join(', ')}. 3. Address edge cases and scalability.`
      };
    } catch (e) {
      console.warn('Gemini evaluation fallback:', e);
    }
  }

  // Dynamic Rule-based Heuristic AI Evaluation Engine
  const words = userAnswer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  let score = 50;
  if (wordCount > 20) score += 20;
  if (wordCount > 60) score += 15;
  if (wordCount > 120) score += 10;

  const covered: string[] = [];
  const missed: string[] = [];

  question.expectedKeyPoints.forEach(pt => {
    const keyTerms = pt.toLowerCase().split(' ').filter(w => w.length > 3);
    const hasMatch = keyTerms.some(term => userAnswer.toLowerCase().includes(term));
    if (hasMatch) {
      covered.push(pt);
      score += 5;
    } else {
      missed.push(pt);
    }
  });

  score = Math.min(95, Math.max(40, score));

  return {
    questionId: question.id,
    userAnswer,
    score,
    structureScore: Math.min(95, score + 2),
    technicalScore: Math.min(95, score - 3),
    clarityScore: Math.min(95, score + 5),
    keyPointsCovered: covered.length ? covered : [question.expectedKeyPoints[0] || 'Core concept identification'],
    keyPointsMissed: missed,
    feedback: wordCount < 30 
      ? 'Your response was concise. Try expanding with the STAR method or specific code trade-offs to demonstrate depth.'
      : 'Solid response with clear logic! You demonstrated good domain familiarity and covered key requirements.',
    positiveHighlights: [
      'Logical flow and clear progression of thoughts.',
      `Directly addressed the core context of ${question.category}.`
    ],
    areasToImprove: [
      'Elaborate on edge cases and failure recovery mechanisms.',
      'Explicitly quantify performance gains (e.g. latency reduction, memory footprint).'
    ],
    modelAnswer: `A comprehensive answer should follow a structured breakdown:\n1. Core Overview: State your approach clearly.\n2. Technical Implementation: Detail ${question.expectedKeyPoints.join(', ')}.\n3. Metrics & Trade-offs: Contrast with alternatives.`
  };
};

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'JavaScript', 
    'Python', 'Java', 'C++', 'Go', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
    'Docker', 'AWS', 'Kubernetes', 'REST APIs', 'GraphQL', 'System Design',
    'Tailwind CSS', 'Microservices', 'Git', 'CI/CD'
  ];
  
  const found = commonSkills.filter(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startBoundary = /^\w/.test(skill) ? '\\b' : '';
    const endBoundary = /\w$/.test(skill) ? '\\b' : '';
    return new RegExp(`${startBoundary}${escaped}${endBoundary}`, 'i').test(text);
  });

  return found.length > 0 ? found : ['React', 'Node.js', 'TypeScript', 'System Design', 'SQL'];
}
