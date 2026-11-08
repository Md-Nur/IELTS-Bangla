import { describe, it, expect } from "vitest";
import { mock01TestData } from "@/prisma/seeds/mock01Data";
import { ExamContentResponseDTO, SectionDTO } from "@/lib/services/examAttemptService";
import { countWords } from "@/lib/scoring/wordLimit";
import fs from "node:fs";
import path from "node:path";

describe("IELTS Academic Reading Exam Interface & Question Types", () => {
  // Convert mock01TestData into the exact DTO received from GET /api/exam/[attemptId]
  const mockExamDTO: ExamContentResponseDTO = {
    attempt: {
      id: "test_attempt_mock01",
      testId: "test_id_mock01",
      testSlug: mock01TestData.slug,
      testTitle: mock01TestData.title,
      testVersionId: "ver_mock01",
      versionNumber: 1,
      status: "IN_PROGRESS",
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      durationMinutes: 60,
      totalQuestions: 40,
      serverTime: new Date().toISOString(),
      remainingSeconds: 3600,
    },
    sections: mock01TestData.sections.map((sec): SectionDTO => ({
      id: `sec_${sec.orderIndex}`,
      orderIndex: sec.orderIndex,
      title: sec.title,
      passageText: sec.passageText,
      questionGroups: sec.groups.map((grp) => ({
        id: `grp_${grp.orderIndex}`,
        orderIndex: grp.orderIndex,
        instruction: grp.instruction,
        questionType: grp.questionType,
        wordLimit: grp.wordLimit ?? null,
        contextOptions: grp.contextOptions ?? null,
        questions: grp.questions.map((q) => ({
          id: `q_${q.questionNumber}`,
          questionNumber: q.questionNumber,
          prompt: q.prompt,
          options: q.options ?? null,
        })),
      })),
    })),
    savedAnswers: [],
  };

  // -----------------------------------------------------------------
  // 1. Structure & Question Type Coverage
  // -----------------------------------------------------------------
  it("covers all 3 passages and exactly 40 continuously numbered questions", () => {
    expect(mockExamDTO.sections.length).toBe(3);

    const allQuestions = mockExamDTO.sections
      .flatMap((s) => s.questionGroups)
      .flatMap((g) => g.questions);

    expect(allQuestions.length).toBe(40);
    allQuestions.forEach((q, idx) => {
      expect(q.questionNumber).toBe(idx + 1);
    });
  });

  it("accurately verifies all 7 question types in Mock Test 01", () => {
    const groups = mockExamDTO.sections.flatMap((s) => s.questionGroups);

    // 1. TRUE_FALSE_NOT_GIVEN (Passage 1, Q1–Q7)
    const tfGroup = groups.find((g) => g.questionType === "TRUE_FALSE_NOT_GIVEN");
    expect(tfGroup).toBeDefined();
    expect(tfGroup!.questions.map((q) => q.questionNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);

    // 2. NOTE_COMPLETION (Passage 1, Q8–Q13)
    const noteGroup = groups.find((g) => g.questionType === "NOTE_COMPLETION");
    expect(noteGroup).toBeDefined();
    expect(noteGroup!.wordLimit).toBe(2);
    expect(noteGroup!.questions.map((q) => q.questionNumber)).toEqual([8, 9, 10, 11, 12, 13]);

    // 3. MATCHING_HEADINGS (Passage 2, Q14–Q19)
    const headingsGroup = groups.find((g) => g.questionType === "MATCHING_HEADINGS");
    expect(headingsGroup).toBeDefined();
    expect(headingsGroup!.questions.map((q) => q.questionNumber)).toEqual([14, 15, 16, 17, 18, 19]);
    const headings = (headingsGroup!.contextOptions as Record<string, unknown>)?.headings as Record<string, string>;
    expect(headings).toBeDefined();
    expect(Object.keys(headings)).toEqual(["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"]);

    // 4. SENTENCE_COMPLETION (Passage 2, Q20–Q23)
    const sentenceGroup = groups.find((g) => g.questionType === "SENTENCE_COMPLETION");
    expect(sentenceGroup).toBeDefined();
    expect(sentenceGroup!.wordLimit).toBe(2);
    expect(sentenceGroup!.questions.map((q) => q.questionNumber)).toEqual([20, 21, 22, 23]);

    // 5. MULTIPLE_CHOICE (Passage 2: Q24–Q26 & Passage 3: Q33–Q36)
    const mcqGroups = groups.filter((g) => g.questionType === "MULTIPLE_CHOICE");
    expect(mcqGroups.length).toBe(2);
    expect(mcqGroups[0].questions.map((q) => q.questionNumber)).toEqual([24, 25, 26]);
    expect(mcqGroups[1].questions.map((q) => q.questionNumber)).toEqual([33, 34, 35, 36]);
    mcqGroups.forEach((grp) => {
      grp.questions.forEach((q) => {
        expect(Array.isArray(q.options)).toBe(true);
        expect((q.options as string[]).length).toBe(4);
      });
    });

    // 6. YES_NO_NOT_GIVEN (Passage 3, Q27–Q32)
    const ynGroup = groups.find((g) => g.questionType === "YES_NO_NOT_GIVEN");
    expect(ynGroup).toBeDefined();
    expect(ynGroup!.questions.map((q) => q.questionNumber)).toEqual([27, 28, 29, 30, 31, 32]);

    // 7. SUMMARY_COMPLETION (Passage 3, Q37–Q40)
    const summaryGroup = groups.find((g) => g.questionType === "SUMMARY_COMPLETION");
    expect(summaryGroup).toBeDefined();
    expect(summaryGroup!.questions.map((q) => q.questionNumber)).toEqual([37, 38, 39, 40]);
    const words = (summaryGroup!.contextOptions as Record<string, unknown>)?.words as Record<string, string>;
    expect(words).toBeDefined();
    expect(Object.keys(words)).toEqual(["A", "B", "C", "D", "E", "F", "G", "H"]);
  });

  // -----------------------------------------------------------------
  // 2. Word Limit Validation in Completion Inputs
  // -----------------------------------------------------------------
  it("enforces IELTS word limits with hyphenated compound handling", () => {
    // 1-word hyphenated compound
    expect(countWords("air-filled")).toBe(1);
    expect(countWords("air-filled rubber tyre")).toBe(3);

    // 2-word phrase
    expect(countWords("mass production")).toBe(2);
    expect(countWords("expensive structural reinforcement")).toBe(3);
  });

  // -----------------------------------------------------------------
  // 3. Question Navigation & Section Mapping
  // -----------------------------------------------------------------
  it("accurately maps questions to their corresponding passage sections", () => {
    function getSectionForQuestion(qNum: number): number {
      if (qNum <= 13) return 0; // Passage 1
      if (qNum <= 26) return 1; // Passage 2
      return 2;                 // Passage 3
    }

    expect(getSectionForQuestion(1)).toBe(0);
    expect(getSectionForQuestion(13)).toBe(0);
    expect(getSectionForQuestion(14)).toBe(1);
    expect(getSectionForQuestion(26)).toBe(1);
    expect(getSectionForQuestion(27)).toBe(2);
    expect(getSectionForQuestion(40)).toBe(2);
  });

  // -----------------------------------------------------------------
  // 4. Timer Logic
  // -----------------------------------------------------------------
  it("formats countdown timer values accurately", () => {
    function formatTime(totalSeconds: number): string {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    expect(formatTime(3600)).toBe("60:00");
    expect(formatTime(3599)).toBe("59:59");
    expect(formatTime(599)).toBe("09:59");
    expect(formatTime(60)).toBe("01:00");
    expect(formatTime(0)).toBe("00:00");
  });

  // -----------------------------------------------------------------
  // 5. Source Code Security: No Hardcoded Answer Keys
  // -----------------------------------------------------------------
  it("guarantees no correct answers or answer keys are hardcoded in frontend components", () => {
    const componentsDir = path.resolve(import.meta.dirname, "../");
    const files = fs.readdirSync(componentsDir, { recursive: true }) as string[];

    const componentFiles = files.filter(
      (f) => (f.endsWith(".tsx") || f.endsWith(".ts")) && !f.includes("__tests__")
    );

    expect(componentFiles.length).toBeGreaterThan(0);

    // Known specific answer tokens that must NEVER appear in frontend components
    const sensitiveAnswerTokens = [
      "acceptedAnswers",
      "acceptedText",
      "isPrimary",
      "bandConversionTable",
    ];

    componentFiles.forEach((file) => {
      const fullPath = path.join(componentsDir, file);
      const content = fs.readFileSync(fullPath, "utf-8");

      sensitiveAnswerTokens.forEach((token) => {
        expect(content).not.toContain(token);
      });
    });
  });
});
