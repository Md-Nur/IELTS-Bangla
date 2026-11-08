import { describe, it, expect } from 'vitest';
import {
  normalizeWhitespace,
  normalizeCase,
  normalizePunctuation,
  normalizeRomanNumeral,
  normalizeChoiceOption,
  normalizeBooleanChoice,
} from '../normalize';
import { countWords, validateWordLimit } from '../wordLimit';
import { calculateEstimatedBand } from '../band';
import {
  evaluateSingleAnswer,
  evaluateReadingAttempt,
  QuestionScoringInput,
} from '../reading';

describe('Scoring Utilities: Normalization', () => {
  it('normalizes whitespace correctly', () => {
    expect(normalizeWhitespace('  mass   production  ')).toBe('mass production');
    expect(normalizeWhitespace('single')).toBe('single');
    expect(normalizeWhitespace('\n\t multi \n line \t')).toBe('multi line');
  });

  it('normalizes case correctly', () => {
    expect(normalizeCase('  FALSE  ')).toBe('false');
    expect(normalizeCase('Air-Filled Rubber Tyre')).toBe('air-filled rubber tyre');
  });

  it('strips enclosing quotes and trailing punctuation without destroying internal hyphens', () => {
    expect(normalizePunctuation('"air-filled"')).toBe('air-filled');
    expect(normalizePunctuation("'mass production.'")).toBe('mass production');
    expect(normalizePunctuation('(between)')).toBe('between');
    expect(normalizePunctuation('life-cycle cost.')).toBe('life-cycle cost');
  });

  it('normalizes Roman numerals for heading matching', () => {
    expect(normalizeRomanNumeral('VII')).toBe('vii');
    expect(normalizeRomanNumeral('  iv. ')).toBe('iv');
    expect(normalizeRomanNumeral('i')).toBe('i');
  });

  it('normalizes multiple choice options', () => {
    expect(normalizeChoiceOption('A')).toBe('A');
    expect(normalizeChoiceOption('b')).toBe('B');
    expect(normalizeChoiceOption('C.')).toBe('C');
    expect(normalizeChoiceOption('(d)')).toBe('D');
  });

  it('normalizes boolean choices (True/False/Not Given and Yes/No)', () => {
    expect(normalizeBooleanChoice('TRUE')).toBe('TRUE');
    expect(normalizeBooleanChoice('t')).toBe('TRUE');
    expect(normalizeBooleanChoice('False')).toBe('FALSE');
    expect(normalizeBooleanChoice('not given')).toBe('NOT GIVEN');
    expect(normalizeBooleanChoice('ng')).toBe('NOT GIVEN');
    expect(normalizeBooleanChoice('YES')).toBe('YES');
    expect(normalizeBooleanChoice('n')).toBe('NO');
  });
});

describe('Scoring Utilities: Word Limit Validation', () => {
  it('counts words in accordance with IELTS rules', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('between')).toBe(1);
    expect(countWords('air-filled')).toBe(1); // Hyphenated word = 1 word
    expect(countWords('mass production')).toBe(2);
    expect(countWords('structural reinforcement')).toBe(2);
    expect(countWords('expensive structural reinforcement')).toBe(3);
  });

  it('enforces word limits correctly', () => {
    // "NO MORE THAN TWO WORDS" (limit = 2)
    expect(validateWordLimit('between', 2).valid).toBe(true);
    expect(validateWordLimit('air-filled', 2).valid).toBe(true);
    expect(validateWordLimit('mass production', 2).valid).toBe(true);
    expect(validateWordLimit('expensive structural reinforcement', 2).valid).toBe(false);

    // Limit = 1
    expect(validateWordLimit('baseline', 1).valid).toBe(true);
    expect(validateWordLimit('life cycle', 1).valid).toBe(false);
    expect(validateWordLimit('life-cycle', 1).valid).toBe(true); // Hyphenated = 1 word
  });
});

describe('Scoring Utilities: Band Conversion', () => {
  it('maps official Mock Test 01 raw scores to exact IELTS bands', () => {
    expect(calculateEstimatedBand(40)).toBe(9.0);
    expect(calculateEstimatedBand(39)).toBe(9.0);
    expect(calculateEstimatedBand(38)).toBe(8.5);
    expect(calculateEstimatedBand(37)).toBe(8.5);
    expect(calculateEstimatedBand(36)).toBe(8.0);
    expect(calculateEstimatedBand(35)).toBe(8.0);
    expect(calculateEstimatedBand(34)).toBe(7.5);
    expect(calculateEstimatedBand(33)).toBe(7.5);
    expect(calculateEstimatedBand(32)).toBe(7.0);
    expect(calculateEstimatedBand(30)).toBe(7.0);
    expect(calculateEstimatedBand(29)).toBe(6.5);
    expect(calculateEstimatedBand(27)).toBe(6.5);
    expect(calculateEstimatedBand(26)).toBe(6.0);
    expect(calculateEstimatedBand(23)).toBe(6.0);
    expect(calculateEstimatedBand(22)).toBe(5.5);
    expect(calculateEstimatedBand(19)).toBe(5.5);
    expect(calculateEstimatedBand(18)).toBe(5.0);
    expect(calculateEstimatedBand(15)).toBe(5.0);
    expect(calculateEstimatedBand(14)).toBe(4.5);
    expect(calculateEstimatedBand(13)).toBe(4.5);
    expect(calculateEstimatedBand(12)).toBe(4.0);
    expect(calculateEstimatedBand(10)).toBe(4.0);
    expect(calculateEstimatedBand(9)).toBe(3.5);
    expect(calculateEstimatedBand(8)).toBe(3.5);
    expect(calculateEstimatedBand(7)).toBe(3.0);
    expect(calculateEstimatedBand(6)).toBe(3.0);
    expect(calculateEstimatedBand(5)).toBe(2.5);
    expect(calculateEstimatedBand(3)).toBe(2.0);
    expect(calculateEstimatedBand(2)).toBe(1.5);
    expect(calculateEstimatedBand(1)).toBe(1.0);
    expect(calculateEstimatedBand(0)).toBe(0.0);
  });
});

describe('Reading Scoring Engine: Single Answer Evaluation', () => {
  const tfQuestion: QuestionScoringInput = {
    questionId: 'q1',
    questionNumber: 1,
    questionType: 'TRUE_FALSE_NOT_GIVEN',
    acceptedAnswers: [{ acceptedText: 'FALSE' }],
  };

  const choiceQuestion: QuestionScoringInput = {
    questionId: 'q24',
    questionNumber: 24,
    questionType: 'MULTIPLE_CHOICE',
    acceptedAnswers: [{ acceptedText: 'B' }],
  };

  const completionQuestion: QuestionScoringInput = {
    questionId: 'q8',
    questionNumber: 8,
    questionType: 'NOTE_COMPLETION',
    wordLimit: 2,
    acceptedAnswers: [{ acceptedText: 'between' }],
  };

  const alternativeQuestion: QuestionScoringInput = {
    questionId: 'q9',
    questionNumber: 9,
    questionType: 'NOTE_COMPLETION',
    wordLimit: 2,
    acceptedAnswers: [{ acceptedText: 'air-filled / air filled' }],
  };

  it('scores True/False/Not Given case-insensitively', () => {
    expect(evaluateSingleAnswer('FALSE', tfQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('false', tfQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('f', tfQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('TRUE', tfQuestion).isCorrect).toBe(false);
    expect(evaluateSingleAnswer('', tfQuestion).isCorrect).toBe(false);
  });

  it('scores Multiple Choice with option letter normalization', () => {
    expect(evaluateSingleAnswer('B', choiceQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('b', choiceQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('B.', choiceQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('(B)', choiceQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('A', choiceQuestion).isCorrect).toBe(false);
  });

  it('scores Completion questions with word limits and whitespace tolerance', () => {
    expect(evaluateSingleAnswer('between', completionQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('  between  ', completionQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('"between"', completionQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('behind', completionQuestion).isCorrect).toBe(false);
  });

  it('rejects answers that exceed the configured word limit even if they contain the keyword', () => {
    const res = evaluateSingleAnswer('sitting low between them', completionQuestion);
    expect(res.isCorrect).toBe(false);
    expect(res.wordLimitExceeded).toBe(true);
    expect(res.scoreAwarded).toBe(0);
  });

  it('matches accepted alternative forms (slash delimited)', () => {
    expect(evaluateSingleAnswer('air-filled', alternativeQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('air filled', alternativeQuestion).isCorrect).toBe(true);
    expect(evaluateSingleAnswer('rubber', alternativeQuestion).isCorrect).toBe(false);
  });
});

describe('Reading Scoring Engine: Full Attempt Evaluation', () => {
  it('correctly calculates raw score, section breakdown, and band for an attempt', () => {
    const questions: QuestionScoringInput[] = [
      {
        questionId: 'q1',
        questionNumber: 1,
        questionType: 'TRUE_FALSE_NOT_GIVEN',
        sectionIndex: 1,
        acceptedAnswers: [{ acceptedText: 'FALSE' }],
      },
      {
        questionId: 'q2',
        questionNumber: 2,
        questionType: 'TRUE_FALSE_NOT_GIVEN',
        sectionIndex: 1,
        acceptedAnswers: [{ acceptedText: 'TRUE' }],
      },
      {
        questionId: 'q14',
        questionNumber: 14,
        questionType: 'MATCHING_HEADINGS',
        sectionIndex: 2,
        acceptedAnswers: [{ acceptedText: 'ii' }],
      },
      {
        questionId: 'q27',
        questionNumber: 27,
        questionType: 'YES_NO_NOT_GIVEN',
        sectionIndex: 3,
        acceptedAnswers: [{ acceptedText: 'YES' }],
      },
    ];

    const studentAnswers = [
      { questionId: 'q1', answerText: 'false' },
      { questionId: 'q2', answerText: 'TRUE' },
      { questionId: 'q14', answerText: 'II' },
      { questionId: 'q27', answerText: 'NO' }, // Incorrect
    ];

    const summary = evaluateReadingAttempt(questions, studentAnswers);

    expect(summary.totalQuestions).toBe(4);
    expect(summary.totalAttempted).toBe(4);
    expect(summary.totalCorrect).toBe(3);
    expect(summary.totalIncorrect).toBe(1);
    expect(summary.rawScore).toBe(3);
    expect(summary.sectionBreakdown.passage1.correct).toBe(2);
    expect(summary.sectionBreakdown.passage1.totalQuestions).toBe(2);
    expect(summary.sectionBreakdown.passage2.correct).toBe(1);
    expect(summary.sectionBreakdown.passage3.correct).toBe(0);
  });
});
