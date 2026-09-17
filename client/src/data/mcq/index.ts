import { MCQPracticeQuestion } from '@/types';
import { csFundamentalsQuestions } from './csFundamentals';
import { companyPrepQuestions } from './companyPrep';
import { roleDomainQuestions } from './roleDomain';

export const allMCQQuestionsByTopic: Record<string, MCQPracticeQuestion[]> = {
  ...csFundamentalsQuestions,
  ...companyPrepQuestions,
  ...roleDomainQuestions
};

/**
 * Fisher-Yates pure shuffle function
 * Generates an unbiased random permutation of the given array without mutating the original.
 */
export function shuffleQuestions<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Gets a fresh randomized mix of questions for a topic.
 * Ensures questions are randomized each time a topic is selected or shuffled.
 */
export function getRandomizedTopicQuestions(
  topic: string,
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard' = 'All'
): MCQPracticeQuestion[] {
  const bank = allMCQQuestionsByTopic[topic] || [];
  const filtered = difficulty === 'All' 
    ? bank 
    : bank.filter(q => q.difficulty === difficulty);

  return shuffleQuestions(filtered);
}
