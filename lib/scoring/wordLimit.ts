/**
 * Word Limit Validation for IELTS Examination
 * In official IELTS conventions:
 * - A hyphenated word (e.g. 'air-filled', 'life-cycle') counts as a single word.
 * - Numbers written in figures (e.g. '20', '1985') count as a single word.
 * - Compound words with spaces (e.g. 'mass production') count as multiple words.
 */

import { normalizeWhitespace } from './normalize';

/**
 * Counts words in a string according to IELTS rules.
 */
export function countWords(text: string): number {
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) return 0;

  // Split by whitespace. Hyphenated compounds (e.g. "air-filled") remain a single token.
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  return tokens.length;
}

/**
 * Validates whether an answer adheres to the configured word limit.
 * If wordLimit is null or undefined, any word count is allowed.
 * Returns { valid: boolean, wordCount: number, limit: number | null }
 */
export function validateWordLimit(
  answer: string | null | undefined,
  wordLimit: number | null | undefined
): { valid: boolean; wordCount: number; limit: number | null } {
  if (!answer || !answer.trim()) {
    return { valid: true, wordCount: 0, limit: wordLimit ?? null };
  }

  const wordCount = countWords(answer);
  if (wordLimit && wordCount > wordLimit) {
    return { valid: false, wordCount, limit: wordLimit };
  }

  return { valid: true, wordCount, limit: wordLimit ?? null };
}
