/**
 * Deterministic Reading Scoring Engine for IELTS Bangla
 * Evaluates student answers against accepted answers without fuzzy/semantic guessing.
 */

import {
  normalizeCase,
  normalizePunctuation,
  normalizeRomanNumeral,
  normalizeChoiceOption,
  normalizeBooleanChoice,
} from './normalize';
import { validateWordLimit } from './wordLimit';
import { calculateEstimatedBand, BandConversionRange } from './band';

export interface AcceptedAnswerInput {
  acceptedText: string;
  isCaseSensitive?: boolean;
}

export interface QuestionScoringInput {
  questionId: string;
  questionNumber: number;
  questionType: string;
  wordLimit?: number | null;
  sectionIndex?: number; // 1 = Passage 1, 2 = Passage 2, etc.
  acceptedAnswers: AcceptedAnswerInput[];
  explanation?: string | null;
}

export interface StudentAnswerInput {
  questionId: string;
  answerText: string | null;
}

export interface QuestionScoreResult {
  questionId: string;
  questionNumber: number;
  studentAnswer: string | null;
  acceptedAnswers: string[];
  isCorrect: boolean;
  scoreAwarded: number;
  wordLimitExceeded: boolean;
  explanation?: string | null;
}

export interface SectionScoreSummary {
  sectionIndex: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  rawScore: number;
  accuracyPercentage: number;
}

export interface ExamScoreSummary {
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  rawScore: number;
  estimatedBand: number;
  sectionBreakdown: Record<string, SectionScoreSummary>;
  questionBreakdown: QuestionScoreResult[];
}

/**
 * Evaluates a single student answer against a question's accepted answer definitions.
 */
export function evaluateSingleAnswer(
  studentAnswer: string | null | undefined,
  question: QuestionScoringInput
): { isCorrect: boolean; scoreAwarded: number; wordLimitExceeded: boolean } {
  if (!studentAnswer || !studentAnswer.trim()) {
    return { isCorrect: false, scoreAwarded: 0, wordLimitExceeded: false };
  }

  const rawAnswer = studentAnswer.trim();

  // 1. Check word limit
  const limitCheck = validateWordLimit(rawAnswer, question.wordLimit);
  if (!limitCheck.valid) {
    return { isCorrect: false, scoreAwarded: 0, wordLimitExceeded: true };
  }

  // 2. Normalize based on question type
  let normalizedStudent = rawAnswer;
  const qType = question.questionType;

  if (qType === 'MULTIPLE_CHOICE') {
    normalizedStudent = normalizeChoiceOption(rawAnswer);
  } else if (qType === 'TRUE_FALSE_NOT_GIVEN' || qType === 'YES_NO_NOT_GIVEN') {
    normalizedStudent = normalizeBooleanChoice(rawAnswer);
  } else if (qType === 'MATCHING_HEADINGS') {
    normalizedStudent = normalizeRomanNumeral(rawAnswer);
  } else {
    // Text completion, short answer, matching information
    normalizedStudent = normalizePunctuation(normalizeCase(rawAnswer));
  }

  // 3. Match against accepted answers
  for (const accepted of question.acceptedAnswers) {
    const rawAccepted = accepted.acceptedText.trim();
    if (!rawAccepted) continue;

    // Check if accepted answer contains alternatives separated by " / " or "/"
    const alternatives = rawAccepted
      .split(/\s*\/\s*/)
      .map((alt) => alt.trim())
      .filter(Boolean);

    for (const alt of alternatives) {
      let targetAccepted = alt;
      if (qType === 'MULTIPLE_CHOICE') {
        targetAccepted = normalizeChoiceOption(alt);
      } else if (qType === 'TRUE_FALSE_NOT_GIVEN' || qType === 'YES_NO_NOT_GIVEN') {
        targetAccepted = normalizeBooleanChoice(alt);
      } else if (qType === 'MATCHING_HEADINGS') {
        targetAccepted = normalizeRomanNumeral(alt);
      } else if (!accepted.isCaseSensitive) {
        targetAccepted = normalizePunctuation(normalizeCase(alt));
      } else {
        targetAccepted = normalizePunctuation(alt);
      }

      if (accepted.isCaseSensitive) {
        if (rawAnswer === targetAccepted) {
          return { isCorrect: true, scoreAwarded: 1, wordLimitExceeded: false };
        }
      } else {
        if (normalizedStudent === targetAccepted) {
          return { isCorrect: true, scoreAwarded: 1, wordLimitExceeded: false };
        }
      }
    }
  }

  return { isCorrect: false, scoreAwarded: 0, wordLimitExceeded: false };
}

/**
 * Evaluates all student answers for an examination attempt.
 */
export function evaluateReadingAttempt(
  questions: QuestionScoringInput[],
  studentAnswers: StudentAnswerInput[],
  bandConversionTable?: BandConversionRange[]
): ExamScoreSummary {
  const answerMap = new Map<string, string | null>();
  for (const ans of studentAnswers) {
    answerMap.set(ans.questionId, ans.answerText);
  }

  // Sort questions continuously by questionNumber
  const sortedQuestions = [...questions].sort(
    (a, b) => a.questionNumber - b.questionNumber
  );

  const questionBreakdown: QuestionScoreResult[] = [];
  const sectionMap = new Map<number, { total: number; attempted: number; correct: number }>();

  let totalAttempted = 0;
  let totalCorrect = 0;

  for (const q of sortedQuestions) {
    const studentAns = answerMap.get(q.questionId) ?? null;
    const isAttempted = studentAns !== null && studentAns.trim().length > 0;
    if (isAttempted) totalAttempted++;

    const evalResult = evaluateSingleAnswer(studentAns, q);
    if (evalResult.isCorrect) totalCorrect++;

    questionBreakdown.push({
      questionId: q.questionId,
      questionNumber: q.questionNumber,
      studentAnswer: studentAns,
      acceptedAnswers: q.acceptedAnswers.map((a) => a.acceptedText),
      isCorrect: evalResult.isCorrect,
      scoreAwarded: evalResult.scoreAwarded,
      wordLimitExceeded: evalResult.wordLimitExceeded,
      explanation: q.explanation ?? null,
    });

    const sIndex = q.sectionIndex ?? 1;
    const currentSection = sectionMap.get(sIndex) ?? { total: 0, attempted: 0, correct: 0 };
    currentSection.total++;
    if (isAttempted) currentSection.attempted++;
    if (evalResult.isCorrect) currentSection.correct++;
    sectionMap.set(sIndex, currentSection);
  }

  const rawScore = totalCorrect;
  const estimatedBand = calculateEstimatedBand(rawScore, bandConversionTable);
  const totalQuestions = sortedQuestions.length;
  const totalIncorrect = totalQuestions - totalCorrect;

  const sectionBreakdown: Record<string, SectionScoreSummary> = {};
  for (const [secIdx, data] of sectionMap.entries()) {
    sectionBreakdown[`passage${secIdx}`] = {
      sectionIndex: secIdx,
      totalQuestions: data.total,
      attempted: data.attempted,
      correct: data.correct,
      rawScore: data.correct,
      accuracyPercentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    };
  }

  return {
    totalQuestions,
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    rawScore,
    estimatedBand,
    sectionBreakdown,
    questionBreakdown,
  };
}
