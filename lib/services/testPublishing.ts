/**
 * Service for publishing draft tests into immutable published test snapshots.
 * Ensures strict validation of question continuity, non-empty accepted answers,
 * and atomic insertion across the composite published hierarchy.
 */

import { PrismaClient, Prisma } from "@prisma/client";
import { DEFAULT_ACADEMIC_READING_BAND_TABLE } from "@/lib/scoring/band";

export interface PublishTestOptions {
  testId: string;
  targetVersionNumber?: number;
  bandConversionTable?: unknown;
}

export interface PublishTestResult {
  publishedVersionId: string;
  versionNumber: number;
  totalQuestions: number;
  sectionsCount: number;
  publishedAt: Date;
}

export class TestPublishingValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestPublishingValidationError";
  }
}

/**
 * Publishes a draft test snapshot into immutable published tables.
 * Executes atomically within a database transaction.
 */
export async function publishDraftTestVersion(
  prisma: PrismaClient | Prisma.TransactionClient,
  options: PublishTestOptions
): Promise<PublishTestResult> {
  const { testId, targetVersionNumber, bandConversionTable } = options;

  // 1. Fetch test with entire draft hierarchy
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      draftSections: {
        orderBy: { orderIndex: "asc" },
        include: {
          groups: {
            orderBy: { orderIndex: "asc" },
            include: {
              questions: {
                orderBy: { questionNumber: "asc" },
                include: {
                  acceptedAnswers: {
                    orderBy: { orderIndex: "asc" },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!test) {
    throw new TestPublishingValidationError(`Test not found with ID: ${testId}`);
  }

  if (test.draftSections.length === 0) {
    throw new TestPublishingValidationError("Cannot publish a test with no sections.");
  }

  // 2. Validate question numbering, non-empty accepted answers, and continuity
  const allQuestions = test.draftSections
    .flatMap((s) => s.groups)
    .flatMap((g) => g.questions);

  if (allQuestions.length === 0) {
    throw new TestPublishingValidationError("Cannot publish a test with no questions.");
  }

  const questionNumbers = allQuestions.map((q) => q.questionNumber);
  const sortedNumbers = [...questionNumbers].sort((a, b) => a - b);
  const totalQuestions = sortedNumbers.length;

  for (let i = 0; i < totalQuestions; i++) {
    const expected = i + 1;
    if (sortedNumbers[i] !== expected) {
      throw new TestPublishingValidationError(
        `Invalid question numbering: expected question number ${expected}, but found ${sortedNumbers[i]}. Question numbering must be continuous from 1 to ${totalQuestions}.`
      );
    }
  }

  // Verify uniqueness of question numbers
  const uniqueNumbers = new Set(questionNumbers);
  if (uniqueNumbers.size !== totalQuestions) {
    throw new TestPublishingValidationError(
      `Duplicate question numbers detected in draft content: ${totalQuestions - uniqueNumbers.size} duplicate(s).`
    );
  }

  // Verify accepted answers exist for every question
  for (const q of allQuestions) {
    if (q.acceptedAnswers.length === 0) {
      throw new TestPublishingValidationError(
        `Question ${q.questionNumber} has no accepted answers. Cannot publish incomplete answer key.`
      );
    }
    for (const ans of q.acceptedAnswers) {
      if (!ans.acceptedText || ans.acceptedText.trim().length === 0) {
        throw new TestPublishingValidationError(
          `Question ${q.questionNumber} has an empty accepted answer.`
        );
      }
    }
  }

  // 3. Resolve target version number
  let versionNumber = targetVersionNumber;
  if (!versionNumber) {
    const latestVersion = await prisma.publishedTestVersion.findFirst({
      where: { testId },
      orderBy: { versionNumber: "desc" },
      select: { versionNumber: true },
    });
    versionNumber = (latestVersion?.versionNumber ?? 0) + 1;
  }

  // Verify version number does not already exist
  const existingVersion = await prisma.publishedTestVersion.findUnique({
    where: {
      testId_versionNumber: {
        testId,
        versionNumber,
      },
    },
  });

  if (existingVersion) {
    throw new TestPublishingValidationError(
      `Published test version ${versionNumber} already exists for test ${testId}.`
    );
  }

  // 4. Resolve band conversion table
  const finalBandTable =
    bandConversionTable ??
    (test.module === "READING" && test.category === "ACADEMIC"
      ? DEFAULT_ACADEMIC_READING_BAND_TABLE
      : DEFAULT_ACADEMIC_READING_BAND_TABLE);

  // 5. Execute snapshot copy
  // First, create the PublishedTestVersion record
  const publishedVersion = await prisma.publishedTestVersion.create({
    data: {
      testId,
      versionNumber,
      title: test.title,
      durationMinutes: test.durationMinutes,
      totalQuestions,
      bandConversionTable: finalBandTable as Prisma.InputJsonValue,
      isArchived: false,
    },
  });

  // Next, create sections, groups, questions, and accepted answers
  for (const draftSection of test.draftSections) {
    const pubSection = await prisma.publishedSection.create({
      data: {
        testVersionId: publishedVersion.id,
        orderIndex: draftSection.orderIndex,
        title: draftSection.title,
        passageText: draftSection.passageText,
      },
    });

    for (const draftGroup of draftSection.groups) {
      const pubGroup = await prisma.publishedQuestionGroup.create({
        data: {
          testVersionId: publishedVersion.id,
          sectionId: pubSection.id,
          orderIndex: draftGroup.orderIndex,
          instruction: draftGroup.instruction,
          questionType: draftGroup.questionType,
          wordLimit: draftGroup.wordLimit,
          contextOptions: draftGroup.contextOptions ? (draftGroup.contextOptions as Prisma.InputJsonValue) : Prisma.JsonNull,
        },
      });

      for (const draftQ of draftGroup.questions) {
        const pubQuestion = await prisma.publishedQuestion.create({
          data: {
            testVersionId: publishedVersion.id,
            questionGroupId: pubGroup.id,
            questionNumber: draftQ.questionNumber,
            prompt: draftQ.prompt,
            options: draftQ.options ? (draftQ.options as Prisma.InputJsonValue) : Prisma.JsonNull,
            explanation: draftQ.explanation,
          },
        });

        for (const draftAns of draftQ.acceptedAnswers) {
          await prisma.publishedAcceptedAnswer.create({
            data: {
              testVersionId: publishedVersion.id,
              questionId: pubQuestion.id,
              acceptedText: draftAns.acceptedText,
              isCaseSensitive: draftAns.isCaseSensitive,
              orderIndex: draftAns.orderIndex,
            },
          });
        }
      }
    }
  }

  return {
    publishedVersionId: publishedVersion.id,
    versionNumber,
    totalQuestions,
    sectionsCount: test.draftSections.length,
    publishedAt: publishedVersion.publishedAt,
  };
}
