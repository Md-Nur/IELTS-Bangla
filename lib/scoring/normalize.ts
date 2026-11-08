/**
 * Answer Normalization Utilities for IELTS Bangla
 * Deterministic text preparation for answer matching.
 */

/**
 * Trims leading/trailing whitespace and collapses internal multiple spaces into one.
 */
export function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Normalizes text to lowercase with standard whitespace cleanup.
 */
export function normalizeCase(text: string): string {
  return normalizeWhitespace(text).toLowerCase();
}

/**
 * Strips outer enclosing quotes, parentheses, and punctuation from answers
 * while preserving internal hyphens and apostrophes (e.g. "air-filled", "Drais's").
 */
export function normalizePunctuation(text: string): string {
  let cleaned = normalizeWhitespace(text);
  // Remove wrapping quotes ('...' or "...")
  cleaned = cleaned.replace(/^['"]+|['"]+$/g, '');
  // Remove wrapping parentheses ((...))
  cleaned = cleaned.replace(/^\(+|\)+$/g, '');
  // Remove trailing period or comma (often added by students at the end of sentences)
  cleaned = cleaned.replace(/[.,;:]+$/g, '');
  return normalizeWhitespace(cleaned);
}

/**
 * Normalizes Roman numerals (used in Matching Headings i to x).
 * Standardizes to lowercase Roman numeral string (e.g. "VII" -> "vii", " iv " -> "iv").
 */
export function normalizeRomanNumeral(text: string): string {
  const cleaned = normalizeCase(text).replace(/[.,]/g, '');
  const romanPattern = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv)$/;
  if (romanPattern.test(cleaned)) {
    return cleaned;
  }
  return cleaned;
}

/**
 * Normalizes multiple choice answer tokens (e.g. "A", "b", "A.", "(C)").
 */
export function normalizeChoiceOption(text: string): string {
  const cleaned = normalizeWhitespace(text).toUpperCase();
  // Match single letter at start, e.g. "A", "A.", "A)", "(A)"
  const match = cleaned.match(/^\(?([A-H])[\).]?$/);
  if (match) {
    return match[1];
  }
  return cleaned;
}

/**
 * Normalizes True/False/Not Given and Yes/No/Not Given answers.
 * Accepts standard abbreviations (T, F, NG, Y, N) or full words.
 */
export function normalizeBooleanChoice(text: string): string {
  const cleaned = normalizeCase(text).replace(/[\s\-_]+/g, '');
  if (cleaned === 'true' || cleaned === 't') return 'TRUE';
  if (cleaned === 'false' || cleaned === 'f') return 'FALSE';
  if (cleaned === 'notgiven' || cleaned === 'ng') return 'NOT GIVEN';
  if (cleaned === 'yes' || cleaned === 'y') return 'YES';
  if (cleaned === 'no' || cleaned === 'n') return 'NO';
  return text.trim().toUpperCase();
}
