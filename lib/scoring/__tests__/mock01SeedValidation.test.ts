import { describe, it, expect } from "vitest";
import { mock01TestData } from "@/prisma/seeds/mock01Data";
import { evaluateReadingAttempt } from "../reading";
import { countWords } from "../wordLimit";
import { getAcademicReadingBandScore } from "../band";

describe("Mock Test 01 Seed Data Validation", () => {
  it("has valid test-level metadata", () => {
    expect(mock01TestData.slug).toBe("academic-reading-mock-01");
    expect(mock01TestData.module).toBe("READING");
    expect(mock01TestData.category).toBe("ACADEMIC");
    expect(mock01TestData.durationMinutes).toBe(60);
    expect(mock01TestData.totalQuestions).toBe(40);
    expect(mock01TestData.sections).toHaveLength(3);
  });

  it("has exactly 40 continuously numbered questions from 1 to 40", () => {
    const questionNumbers: number[] = [];

    for (const section of mock01TestData.sections) {
      expect(section.passageText.trim().length).toBeGreaterThan(100);
      expect(section.title.trim().length).toBeGreaterThan(5);

      for (const group of section.groups) {
        expect(group.instruction.trim().length).toBeGreaterThan(10);
        for (const question of group.questions) {
          questionNumbers.push(question.questionNumber);

          expect(question.prompt.trim().length).toBeGreaterThan(3);
          expect(question.explanation.trim().length).toBeGreaterThan(10);
          expect(question.acceptedAnswers.length).toBeGreaterThanOrEqual(1);

          // Verify exactly one primary accepted answer
          const primaries = question.acceptedAnswers.filter((a) => a.isPrimary);
          expect(primaries).toHaveLength(1);
        }
      }
    }

    expect(questionNumbers).toHaveLength(40);
    const sorted = [...questionNumbers].sort((a, b) => a - b);
    const expected = Array.from({ length: 40 }, (_, i) => i + 1);
    expect(sorted).toEqual(expected);
  });

  it("validates word limits on completion question groups", () => {
    for (const section of mock01TestData.sections) {
      for (const group of section.groups) {
        if (group.wordLimit != null) {
          expect(group.wordLimit).toBe(2);
          for (const question of group.questions) {
            for (const answer of question.acceptedAnswers) {
              const words = countWords(answer.acceptedText);
              expect(words).toBeLessThanOrEqual(group.wordLimit);
            }
          }
        }
      }
    }
  });

  it("validates multiple choice questions have options", () => {
    const mcQuestions = mock01TestData.sections
      .flatMap((s) => s.groups)
      .filter((g) => g.questionType === "MULTIPLE_CHOICE")
      .flatMap((g) => g.questions);

    expect(mcQuestions.length).toBe(7); // Q24-26 (3) + Q33-36 (4) = 7

    for (const q of mcQuestions) {
      expect(q.options).toBeDefined();
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options?.length).toBe(4);
      const primary = q.acceptedAnswers.find((a) => a.isPrimary)?.acceptedText;
      expect(["A", "B", "C", "D"]).toContain(primary);
    }
  });

  it("validates matching headings reference valid roman numerals", () => {
    const headingsGroup = mock01TestData.sections[1].groups[0];
    expect(headingsGroup.questionType).toBe("MATCHING_HEADINGS");
    expect(headingsGroup.questions).toHaveLength(6);

    const validRomanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"];
    for (const q of headingsGroup.questions) {
      const primary = q.acceptedAnswers.find((a) => a.isPrimary)?.acceptedText;
      expect(validRomanNumerals).toContain(primary);
    }
  });

  it("validates band conversion table completeness", () => {
    for (let score = 0; score <= 40; score++) {
      const band = getAcademicReadingBandScore(score);
      expect(band).toBeGreaterThanOrEqual(0);
      expect(band).toBeLessThanOrEqual(9.0);
    }
    expect(getAcademicReadingBandScore(40)).toBe(9.0);
    expect(getAcademicReadingBandScore(39)).toBe(9.0);
    expect(getAcademicReadingBandScore(38)).toBe(8.5);
    expect(getAcademicReadingBandScore(30)).toBe(7.0);
    expect(getAcademicReadingBandScore(23)).toBe(6.0);
    expect(getAcademicReadingBandScore(15)).toBe(5.0);
    expect(getAcademicReadingBandScore(0)).toBe(0.0);
  });

  it("simulates golden run: 40/40 primary answers yield Band 9.0", () => {
    // Collect all 40 questions with their accepted answers
    const allQuestions = mock01TestData.sections.flatMap((s) =>
      s.groups.flatMap((g) =>
        g.questions.map((q) => ({
          questionId: `q-${q.questionNumber}`,
          questionNumber: q.questionNumber,
          questionType: g.questionType,
          wordLimit: g.wordLimit,
          sectionIndex: s.orderIndex,
          acceptedAnswers: q.acceptedAnswers.map((a) => ({
            acceptedText: a.acceptedText,
            isCaseSensitive: Boolean(a.isCaseSensitive),
          })),
        }))
      )
    );

    // Build perfect student answers from primary answers
    const studentAnswers = mock01TestData.sections.flatMap((s) =>
      s.groups.flatMap((g) =>
        g.questions.map((q) => ({
          questionId: `q-${q.questionNumber}`,
          answerText: q.acceptedAnswers.find((a) => a.isPrimary)!.acceptedText,
        }))
      )
    );

    const result = evaluateReadingAttempt(allQuestions, studentAnswers);
    expect(result.rawScore).toBe(40);
    expect(result.totalQuestions).toBe(40);
    expect(result.estimatedBand).toBe(9.0);
    expect(result.questionBreakdown.every((pq) => pq.isCorrect)).toBe(true);
  });

  it("simulates alternative answers: variations (case, abbreviation, synonym) yield 40/40 and Band 9.0", () => {
    const allQuestions = mock01TestData.sections.flatMap((s) =>
      s.groups.flatMap((g) =>
        g.questions.map((q) => ({
          questionId: `q-${q.questionNumber}`,
          questionNumber: q.questionNumber,
          questionType: g.questionType,
          wordLimit: g.wordLimit,
          sectionIndex: s.orderIndex,
          acceptedAnswers: q.acceptedAnswers.map((a) => ({
            acceptedText: a.acceptedText,
            isCaseSensitive: Boolean(a.isCaseSensitive),
          })),
        }))
      )
    );

    // Variations test
    const alternativeAnswers = [
      { questionId: "q-1", answerText: "f" },
      { questionId: "q-2", answerText: "t" },
      { questionId: "q-3", answerText: "ng" },
      { questionId: "q-4", answerText: "true" },
      { questionId: "q-5", answerText: "T" },
      { questionId: "q-6", answerText: "False" },
      { questionId: "q-7", answerText: "not given" },
      { questionId: "q-8", answerText: "Between" },
      { questionId: "q-9", answerText: "air filled" }, // hyphen alternative
      { questionId: "q-10", answerText: "Mass Production" },
      { questionId: "q-11", answerText: "  independence  " },
      { questionId: "q-12", answerText: "fuel prices" },
      { questionId: "q-13", answerText: "ELECTRIC" },
      { questionId: "q-14", answerText: "II" }, // Roman numeral case
      { questionId: "q-15", answerText: "i" },
      { questionId: "q-16", answerText: "VII" },
      { questionId: "q-17", answerText: "iv" },
      { questionId: "q-18", answerText: "vi" },
      { questionId: "q-19", answerText: "V" },
      { questionId: "q-20", answerText: "growing material" },
      { questionId: "q-21", answerText: "  Overflows  " }, // whitespace/case variation
      { questionId: "q-22", answerText: "Islands" }, // case variation
      { questionId: "q-23", answerText: "structural reinforcement" },
      { questionId: "q-24", answerText: "b" },
      { questionId: "q-25", answerText: "B" },
      { questionId: "q-26", answerText: "c" },
      { questionId: "q-27", answerText: "y" },
      { questionId: "q-28", answerText: "n" },
      { questionId: "q-29", answerText: "ng" },
      { questionId: "q-30", answerText: "yes" },
      { questionId: "q-31", answerText: "no" },
      { questionId: "q-32", answerText: "YES" },
      { questionId: "q-33", answerText: "c" },
      { questionId: "q-34", answerText: "a" },
      { questionId: "q-35", answerText: "d" },
      { questionId: "q-36", answerText: "b" },
      { questionId: "q-37", answerText: "a" }, // lowercase letter variation
      { questionId: "q-38", answerText: "(C)" }, // formatted letter variation
      { questionId: "q-39", answerText: "d" }, // lowercase letter variation
      { questionId: "q-40", answerText: "E." }, // formatted letter variation
    ];

    const result = evaluateReadingAttempt(allQuestions, alternativeAnswers);
    expect(result.rawScore).toBe(40);
    expect(result.estimatedBand).toBe(9.0);
    expect(result.questionBreakdown.every((pq) => pq.isCorrect)).toBe(true);
  });

  it("evaluates empty answers as 0/40 and Band 0.0", () => {
    const allQuestions = mock01TestData.sections.flatMap((s) =>
      s.groups.flatMap((g) =>
        g.questions.map((q) => ({
          questionId: `q-${q.questionNumber}`,
          questionNumber: q.questionNumber,
          questionType: g.questionType,
          wordLimit: g.wordLimit,
          sectionIndex: s.orderIndex,
          acceptedAnswers: q.acceptedAnswers.map((a) => ({
            acceptedText: a.acceptedText,
            isCaseSensitive: Boolean(a.isCaseSensitive),
          })),
        }))
      )
    );

    const result = evaluateReadingAttempt(allQuestions, []);
    expect(result.rawScore).toBe(0);
    expect(result.estimatedBand).toBe(0.0);
    expect(result.questionBreakdown.every((pq) => !pq.isCorrect)).toBe(true);
  });
});
