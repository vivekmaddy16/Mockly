/// <reference types="jest" />
import { computeSentenceHighlights } from '../lib/gemini';

describe('computeSentenceHighlights', () => {
  it('should classify strong sentences correctly', () => {
    const text = 'We optimized the latency because we implemented caching.';
    const covered = ['caching'];
    const result = computeSentenceHighlights(text, covered);
    expect(result[0].status).toBe('strong');
    expect(result[0].reason).toContain('technical precision');
  });

  it('should classify weak filler-filled sentences correctly', () => {
    const text = 'Maybe we can just do something like that.';
    const covered: string[] = [];
    const result = computeSentenceHighlights(text, covered);
    expect(result[0].status).toBe('weak');
    expect(result[0].reason).toContain('filler words');
  });

  it('should classify general background sentences as neutral', () => {
    const text = 'This is a normal sentence describing the architecture.';
    const covered: string[] = [];
    const result = computeSentenceHighlights(text, covered);
    expect(result[0].status).toBe('neutral');
    expect(result[0].reason).toContain('conversational context');
  });
});
