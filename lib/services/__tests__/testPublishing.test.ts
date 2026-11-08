import { describe, it, expect, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { publishDraftTestVersion, TestPublishingValidationError } from "../testPublishing";

describe("Test Publishing Service", () => {
  it("throws TestPublishingValidationError if test is not found", async () => {
    const mockPrisma = {
      test: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaClient;

    await expect(
      publishDraftTestVersion(mockPrisma, { testId: "non-existent" })
    ).rejects.toThrow(TestPublishingValidationError);
  });

  it("throws TestPublishingValidationError if test has no sections", async () => {
    const mockPrisma = {
      test: {
        findUnique: vi.fn().mockResolvedValue({
          id: "test-1",
          title: "Test",
          draftSections: [],
        }),
      },
    } as unknown as PrismaClient;

    await expect(
      publishDraftTestVersion(mockPrisma, { testId: "test-1" })
    ).rejects.toThrow("Cannot publish a test with no sections.");
  });

  it("throws TestPublishingValidationError if test has discontinuous question numbers", async () => {
    const mockPrisma = {
      test: {
        findUnique: vi.fn().mockResolvedValue({
          id: "test-1",
          title: "Test",
          draftSections: [
            {
              orderIndex: 1,
              title: "Passage 1",
              passageText: "Text...",
              groups: [
                {
                  orderIndex: 1,
                  questions: [
                    { questionNumber: 1, acceptedAnswers: [{ acceptedText: "A" }] },
                    { questionNumber: 3, acceptedAnswers: [{ acceptedText: "B" }] }, // missing 2
                  ],
                },
              ],
            },
          ],
        }),
      },
    } as unknown as PrismaClient;

    await expect(
      publishDraftTestVersion(mockPrisma, { testId: "test-1" })
    ).rejects.toThrow(/Invalid question numbering: expected question number 2/);
  });

  it("throws TestPublishingValidationError if a question has no accepted answers", async () => {
    const mockPrisma = {
      test: {
        findUnique: vi.fn().mockResolvedValue({
          id: "test-1",
          title: "Test",
          draftSections: [
            {
              orderIndex: 1,
              title: "Passage 1",
              passageText: "Text...",
              groups: [
                {
                  orderIndex: 1,
                  questions: [
                    { questionNumber: 1, acceptedAnswers: [] }, // empty answers
                  ],
                },
              ],
            },
          ],
        }),
      },
    } as unknown as PrismaClient;

    await expect(
      publishDraftTestVersion(mockPrisma, { testId: "test-1" })
    ).rejects.toThrow(/Question 1 has no accepted answers/);
  });

  it("successfully validates and creates published hierarchy", async () => {
    const mockCreatedVersion = {
      id: "pub-ver-1",
      testId: "test-1",
      versionNumber: 1,
      publishedAt: new Date("2026-11-08T00:00:00Z"),
    };

    const mockPrisma = {
      test: {
        findUnique: vi.fn().mockResolvedValue({
          id: "test-1",
          title: "Academic Reading Mock 01",
          durationMinutes: 60,
          module: "READING",
          category: "ACADEMIC",
          draftSections: [
            {
              orderIndex: 1,
              title: "Passage 1",
              passageText: "Passage content...",
              groups: [
                {
                  orderIndex: 1,
                  instruction: "Instructions...",
                  questionType: "TRUE_FALSE_NOT_GIVEN",
                  wordLimit: null,
                  contextOptions: null,
                  questions: [
                    {
                      questionNumber: 1,
                      prompt: "Prompt 1",
                      options: null,
                      explanation: "Explanation 1",
                      acceptedAnswers: [
                        { acceptedText: "TRUE", isCaseSensitive: false, orderIndex: 0 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      },
      publishedTestVersion: {
        findFirst: vi.fn().mockResolvedValue(null),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(mockCreatedVersion),
      },
      publishedSection: {
        create: vi.fn().mockResolvedValue({ id: "pub-sec-1" }),
      },
      publishedQuestionGroup: {
        create: vi.fn().mockResolvedValue({ id: "pub-grp-1" }),
      },
      publishedQuestion: {
        create: vi.fn().mockResolvedValue({ id: "pub-q-1" }),
      },
      publishedAcceptedAnswer: {
        create: vi.fn().mockResolvedValue({ id: "pub-ans-1" }),
      },
    } as unknown as PrismaClient;

    const result = await publishDraftTestVersion(mockPrisma, { testId: "test-1" });

    expect(result.publishedVersionId).toBe("pub-ver-1");
    expect(result.versionNumber).toBe(1);
    expect(result.totalQuestions).toBe(1);
    expect(result.sectionsCount).toBe(1);

    expect(mockPrisma.publishedTestVersion.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.publishedSection.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        testVersionId: "pub-ver-1",
        orderIndex: 1,
      }),
    });
    expect(mockPrisma.publishedQuestionGroup.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        testVersionId: "pub-ver-1",
        sectionId: "pub-sec-1",
      }),
    });
    expect(mockPrisma.publishedQuestion.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        testVersionId: "pub-ver-1",
        questionGroupId: "pub-grp-1",
        questionNumber: 1,
      }),
    });
    expect(mockPrisma.publishedAcceptedAnswer.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        testVersionId: "pub-ver-1",
        questionId: "pub-q-1",
        acceptedText: "TRUE",
      }),
    });
  });
});
