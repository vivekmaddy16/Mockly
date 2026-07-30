import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, QuestionEvaluation, ExperienceLevel } from '@/types';

export const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
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
  questionCount: number = 3,
  difficultyMode: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  roundType: 'technical_screen' | 'dsa' | 'system_design' | 'behavioral' = 'technical_screen'
): Promise<{ questions: Question[]; extractedSkills: string[] }> => {
  const genAI = getGeminiClient();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let roundPrompt = '';
      if (roundType === 'dsa') {
        roundPrompt = `
Round focus: "Algorithms & Coding (DSA)".
Generate pure data structures and algorithms questions (e.g. Arrays, Recursion, Trees, Graphs, Dynamic Programming). 
For each question, you MUST provide an initial code snippet template or scaffolding in the 'contextOrCode' field. The questions should ask the candidate to explain their programmatic approach and state the Big-O time and space complexity.
`;
      } else if (roundType === 'system_design') {
        roundPrompt = `
Round focus: "System Design & Architecture".
Generate questions on designing large-scale distributed systems, system trade-offs, microservices, databases, load balancing, caching strategies, and scale bottlenecks. Do not include coding snippets.
`;
      } else if (roundType === 'behavioral') {
        roundPrompt = `
Round focus: "Behavioral & HR".
Generate situational, leadership, teamwork, or conflict-resolution questions. These should test the candidate's communication, empathy, and past problem-solving using the STAR (Situation, Task, Action, Result) method.
`;
      } else {
        // technical_screen
        roundPrompt = `
Round focus: "Technical Screening".
Generate general conceptual questions covering the candidate's resume, technical breadth matching the target role, basic programming standards, and job requirements.
`;
      }

      const prompt = `
You are an expert technical interviewer for top technology companies.
Generate ${questionCount} customized, high-quality interview questions for a candidate interviewing for the role of "${targetRole}" at experience level "${experienceLevel}" with an overall interview difficulty of "${difficultyMode}".

Interview Round Context:
${roundPrompt}

${resumeText ? `Candidate Resume Content:\n${resumeText.slice(0, 1500)}\n` : ''}
${jobDescriptionText ? `Job Description Requirements:\n${jobDescriptionText.slice(0, 1500)}\n` : ''}

Instructions:
1. Ensure all questions match the target role, experience level, and the specific round focus described above.
2. Return ONLY a valid raw JSON object matching the JSON schema below. Do not include markdown code block formatting like \`\`\`json.

JSON Schema:
{
  "extractedSkills": ["Skill1", "Skill2", "Skill3"],
  "questions": [
    {
      "id": "q_1",
      "type": "${roundType === 'behavioral' ? 'behavioral' : 'technical'}",
      "category": "DSA / Frontend / Backend / System Design / HR",
      "questionText": "Detailed question prompt...",
      "contextOrCode": "Initial code snippet template, or empty if not applicable",
      "expectedKeyPoints": ["Key point 1", "Key point 2"],
      "difficulty": "${difficultyMode}"
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
  
  if (roundType === 'dsa') {
    generated.push({
      id: `gen_q1_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'technical',
      category: 'DSA (Data Structures & Algorithms)',
      questionText: `Given an array of integers, how would you find the contiguous subarray (containing at least one number) which has the largest sum and return its sum? Explain your logic, and state the time and space complexity.`,
      contextOrCode: `function maxSubArray(nums: number[]): number {\n  // Implement Kadane's Algorithm\n}`,
      expectedKeyPoints: [
        "Kadane's Algorithm implementation",
        "O(n) time complexity and O(1) space complexity",
        "Handling negative number edge cases"
      ],
      difficulty: difficultyMode
    });

    if (questionCount >= 2) {
      generated.push({
        id: `gen_q2_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `How would you design and implement a Least Recently Used (LRU) Cache? Explain the data structures you would use to achieve O(1) time complexity for both get and put operations.`,
        contextOrCode: `class LRUCache {\n  constructor(capacity: number) {}\n  get(key: number): number {}\n  put(key: number, value: number): void {}\n}`,
        expectedKeyPoints: [
          "Use of Doubly Linked List and Hash Map",
          "O(1) lookup and insertion complexity",
          "Eviction policy details when capacity is reached"
        ],
        difficulty: difficultyMode
      });
    }

    if (questionCount >= 3) {
      generated.push({
        id: `gen_q3_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `Given a binary tree, write an algorithm to perform an in-order traversal iteratively without using recursion. What are the space implications?`,
        contextOrCode: `function inorderTraversal(root: TreeNode | null): number[] {\n  // Iterative in-order traversal using stack\n}`,
        expectedKeyPoints: [
          "Use of stack data structure to track nodes",
          "O(n) time complexity and O(h) space complexity where h is height",
          "Correct traversal order (Left, Root, Right)"
        ],
        difficulty: difficultyMode
      });
    }
  } else if (roundType === 'system_design') {
    generated.push({
      id: `gen_q1_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'technical',
      category: 'System Design',
      questionText: `Design a high-throughput, globally distributed URL shortening service like Bit.ly. Focus on key system metrics, database selection (SQL vs NoSQL), scaling reads vs writes, and cache eviction policies.`,
      expectedKeyPoints: [
        "Unique ID generation (Base62 encoding or Snowflake ID)",
        "Database choice for fast read lookups (NoSQL key-value store or SQL with indexes)",
        "Use of Redis caching for hot redirection paths",
        "Load balancers and horizontal scaling"
      ],
      difficulty: difficultyMode
    });

    if (questionCount >= 2) {
      generated.push({
        id: `gen_q2_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'technical',
        category: 'System Design & Architecture',
        questionText: `How would you architect a real-time collaborative doc editing platform (like Google Docs) handling concurrent edits? What synchronization protocols would you choose?`,
        expectedKeyPoints: [
          "Operational Transformation (OT) or Conflict-free Replicated Data Types (CRDTs)",
          "WebSockets for duplex low-latency client-server connection",
          "Redis Pub/Sub or Kafka message queuing",
          "Database concurrency controls and state synchronization"
        ],
        difficulty: difficultyMode
      });
    }

    if (questionCount >= 3) {
      generated.push({
        id: `gen_q3_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'technical',
        category: 'System Design & Scaling',
        questionText: `Explain how you would design a rate limiter to protect an API gateway from DDoS attacks or abuse. Compare token bucket, leaking bucket, and sliding window algorithms.`,
        expectedKeyPoints: [
          "Token bucket, leaking bucket, or sliding window algorithms",
          "Redis in-memory store for rate limiting counters",
          "Middleware interceptors at API gateway level",
          "Graceful HTTP 429 Too Many Requests response handling"
        ],
        difficulty: difficultyMode
      });
    }
  } else if (roundType === 'behavioral') {
    generated.push({
      id: `gen_q1_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'behavioral',
      category: 'Behavioral & Leadership',
      questionText: `Describe a time when you had a major technical disagreement with a team lead or colleague on the architectural direction of a project. How did you handle the situation and resolve the conflict?`,
      expectedKeyPoints: [
        "STAR format (Situation, Task, Action, Result)",
        "Constructive conflict management and active listening",
        "Data-driven trade-off analysis",
        "Supporting the final decision to align with project milestones"
      ],
      difficulty: difficultyMode
    });

    if (questionCount >= 2) {
      generated.push({
        id: `gen_q2_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'behavioral',
        category: 'Behavioral & Leadership',
        questionText: `Tell me about a time you had to balance shipping a critical feature to meet a business deadline versus maintaining high technical quality. How did you handle the engineering trade-offs and technical debt?`,
        expectedKeyPoints: [
          "STAR format (Situation, Task, Action, Result)",
          "Proactive alignment and collaboration with product management",
          "Documenting and scheduling refactoring cycles",
          "Minimizing risk and core system stability"
        ],
        difficulty: difficultyMode
      });
    }

    if (questionCount >= 3) {
      generated.push({
        id: `gen_q3_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'behavioral',
        category: 'Behavioral & Adaptability',
        questionText: `Describe a situation where a project scope or requirement changed dramatically mid-development. How did you adapt your plan, communicate the changes, and deliver?`,
        expectedKeyPoints: [
          "STAR format (Situation, Task, Action, Result)",
          "Agile response to dynamic requirements",
          "Clear and transparent updates to key stakeholders",
          "Prioritizing minimal viable scope items"
        ],
        difficulty: difficultyMode
      });
    }
  } else {
    // technical_screen
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
      difficulty: difficultyMode
    });

    if (questionCount >= 2) {
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
        difficulty: difficultyMode
      });
    }

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
        difficulty: difficultyMode
      });
    }
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
Question Difficulty: ${question.difficulty}
Question: "${question.questionText}"
Expected Key Points: ${question.expectedKeyPoints.join(', ')}

Candidate's Answer:
"${userAnswer}"

Instructions:
Evaluate the answer critically and constructively, calibrating your expectations according to the question difficulty level ("${question.difficulty}").
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
