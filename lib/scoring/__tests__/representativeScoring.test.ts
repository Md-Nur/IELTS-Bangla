import { describe, it, expect } from 'vitest';
import {
  evaluateSingleAnswer,
  evaluateReadingAttempt,
  QuestionScoringInput,
} from '../reading';
import { mock01TestData } from '../../../prisma/seeds/mock01Data';

describe('Scoring Verification: Representative Answers Across All Question Types', () => {
  // Flatten mock01 questions into QuestionScoringInput list
  const allScoringQuestions: QuestionScoringInput[] = mock01TestData.sections.flatMap(
    (sec) =>
      sec.groups.flatMap((grp) =>
        grp.questions.map((q) => ({
          questionId: `mock-q-${q.questionNumber}`,
          questionNumber: q.questionNumber,
          questionType: grp.questionType,
          wordLimit: grp.wordLimit,
          sectionIndex: sec.orderIndex,
          acceptedAnswers: q.acceptedAnswers,
          explanation: q.explanation,
        }))
      )
  );

  function getQ(num: number): QuestionScoringInput {
    const q = allScoringQuestions.find((item) => item.questionNumber === num);
    if (!q) throw new Error(`Question ${num} not found`);
    return q;
  }

  describe('1. True / False / Not Given (Passage 1: Q1–Q7)', () => {
    it('evaluates correct answers and accepted abbreviations', () => {
      expect(evaluateSingleAnswer('FALSE', getQ(1)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('f', getQ(1)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('TRUE', getQ(2)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('t', getQ(2)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('NOT GIVEN', getQ(3)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('ng', getQ(3)).isCorrect).toBe(true);
    });

    it('evaluates case and whitespace differences', () => {
      expect(evaluateSingleAnswer('  False  ', getQ(1)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('  tRuE  ', getQ(2)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('\tnot   given\n', getQ(3)).isCorrect).toBe(true);
    });

    it('rejects incorrect answers and empty inputs', () => {
      expect(evaluateSingleAnswer('TRUE', getQ(1)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('FALSE', getQ(2)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('', getQ(1)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer(null, getQ(1)).isCorrect).toBe(false);
    });
  });

  describe('2. Note Completion (Passage 1: Q8–Q13, Word Limit: 2)', () => {
    it('evaluates correct answers', () => {
      expect(evaluateSingleAnswer('between', getQ(8)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('mass production', getQ(10)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('independence', getQ(11)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('fuel prices', getQ(12)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('electric', getQ(13)).isCorrect).toBe(true);
    });

    it('evaluates hyphenated words vs spaced words (Q9: air-filled / air filled)', () => {
      expect(evaluateSingleAnswer('air-filled', getQ(9)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('air filled', getQ(9)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('AIR-FILLED', getQ(9)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('  Air  Filled  ', getQ(9)).isCorrect).toBe(true);
    });

    it('rejects word-limit violations', () => {
      const res = evaluateSingleAnswer('sitting low between them', getQ(8));
      expect(res.isCorrect).toBe(false);
      expect(res.wordLimitExceeded).toBe(true);
      expect(res.scoreAwarded).toBe(0);
    });

    it('handles punctuation trimming', () => {
      expect(evaluateSingleAnswer('"between"', getQ(8)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer("'mass production.'", getQ(10)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('(electric)', getQ(13)).isCorrect).toBe(true);
    });
  });

  describe('3. Matching Headings (Passage 2: Q14–Q19, Roman Numerals i–ix)', () => {
    it('evaluates correct Roman numerals and uppercase variants', () => {
      expect(evaluateSingleAnswer('ii', getQ(14)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('II', getQ(14)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('i', getQ(15)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('I', getQ(15)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('vii', getQ(16)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('VII', getQ(16)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('iv', getQ(17)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('IV', getQ(17)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('vi', getQ(18)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('VI', getQ(18)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('v', getQ(19)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('V', getQ(19)).isCorrect).toBe(true);
    });

    it('rejects wrong headings', () => {
      expect(evaluateSingleAnswer('iii', getQ(14)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('viii', getQ(14)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('ix', getQ(15)).isCorrect).toBe(false);
    });
  });

  describe('4. Sentence Completion (Passage 2: Q20–Q23, Word Limit: 2)', () => {
    it('evaluates correct answers and accepted alternatives', () => {
      expect(evaluateSingleAnswer('growing material', getQ(20)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('overflows', getQ(21)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('overflow', getQ(21)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('islands', getQ(22)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('isolated islands', getQ(22)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('structural reinforcement', getQ(23)).isCorrect).toBe(true);
    });

    it('rejects word-limit violations', () => {
      const res = evaluateSingleAnswer('expensive structural reinforcement', getQ(23));
      expect(res.isCorrect).toBe(false);
      expect(res.wordLimitExceeded).toBe(true);
    });
  });

  describe('5. Multiple Choice (Passage 2: Q24–Q26 & Passage 3: Q33–Q36)', () => {
    it('evaluates correct letters, lowercase, and formatted letters', () => {
      expect(evaluateSingleAnswer('B', getQ(24)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('b', getQ(24)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('(B)', getQ(24)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('B.', getQ(24)).isCorrect).toBe(true);

      expect(evaluateSingleAnswer('B', getQ(25)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('C', getQ(26)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('C', getQ(33)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('A', getQ(34)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('D', getQ(35)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('B', getQ(36)).isCorrect).toBe(true);
    });

    it('rejects incorrect choices', () => {
      expect(evaluateSingleAnswer('A', getQ(24)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('D', getQ(33)).isCorrect).toBe(false);
    });
  });

  describe('6. Yes / No / Not Given (Passage 3: Q27–Q32)', () => {
    it('evaluates correct claims and abbreviations', () => {
      expect(evaluateSingleAnswer('YES', getQ(27)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('y', getQ(27)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('NO', getQ(28)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('n', getQ(28)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('NOT GIVEN', getQ(29)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('ng', getQ(29)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('YES', getQ(30)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('NO', getQ(31)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('YES', getQ(32)).isCorrect).toBe(true);
    });

    it('rejects incorrect claims', () => {
      expect(evaluateSingleAnswer('NO', getQ(27)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('YES', getQ(28)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('YES', getQ(31)).isCorrect).toBe(false);
    });
  });

  describe('7. Summary Completion with Word List (Passage 3: Q37–Q40)', () => {
    it('accepts option letter (A, C, D, E), case-insensitive and formatted', () => {
      expect(evaluateSingleAnswer('A', getQ(37)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('a', getQ(37)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('(A)', getQ(37)).isCorrect).toBe(true);

      expect(evaluateSingleAnswer('C', getQ(38)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('c', getQ(38)).isCorrect).toBe(true);

      expect(evaluateSingleAnswer('D', getQ(39)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('d', getQ(39)).isCorrect).toBe(true);

      expect(evaluateSingleAnswer('E', getQ(40)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('e', getQ(40)).isCorrect).toBe(true);
    });

    it('accepts matched word text and option + word combination', () => {
      expect(evaluateSingleAnswer('predator', getQ(37)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('PREDATOR', getQ(37)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('A predator', getQ(37)).isCorrect).toBe(true);

      expect(evaluateSingleAnswer('triggers', getQ(38)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('C triggers', getQ(38)).isCorrect).toBe(true);

      expect(evaluateSingleAnswer('skill', getQ(39)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('D skill', getQ(39)).isCorrect).toBe(true);

      expect(evaluateSingleAnswer('unproductive', getQ(40)).isCorrect).toBe(true);
      expect(evaluateSingleAnswer('E unproductive', getQ(40)).isCorrect).toBe(true);
    });

    it('rejects incorrect words or letters from the list', () => {
      expect(evaluateSingleAnswer('B', getQ(37)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('reward', getQ(37)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('hunter', getQ(37)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('H', getQ(37)).isCorrect).toBe(false);
      expect(evaluateSingleAnswer('exhausting', getQ(40)).isCorrect).toBe(false);
    });
  });

  describe('8. Full Exam Attempt Scoring with Mixed Answers', () => {
    it('scores a realistic student attempt with mixed answers', () => {
      const studentAnswers = allScoringQuestions.map((q) => {
        // Answer Q1-Q20 correctly, Q21-Q30 with variants, Q31-Q35 wrong, Q36-Q40 correct
        if (q.questionNumber >= 31 && q.questionNumber <= 35) {
          return { questionId: q.questionId, answerText: 'WRONG_ANSWER' };
        }
        return {
          questionId: q.questionId,
          answerText: q.acceptedAnswers[0].acceptedText,
        };
      });

      const result = evaluateReadingAttempt(allScoringQuestions, studentAnswers);
      expect(result.totalQuestions).toBe(40);
      expect(result.totalAttempted).toBe(40);
      expect(result.totalCorrect).toBe(35);
      expect(result.totalIncorrect).toBe(5);
      expect(result.rawScore).toBe(35);
      expect(result.estimatedBand).toBe(8.0);
    });
  });
});
