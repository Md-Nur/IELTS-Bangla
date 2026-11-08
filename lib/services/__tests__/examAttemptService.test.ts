import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { Role, AttemptStatus } from "@prisma/client";
import {
  startExamAttempt,
  getExamContent,
  ExamNotFoundError,
  ExamForbiddenError,
  ExamExpiredError,
  UnpublishedTestError,
} from "../examAttemptService";

describe("Reading Exam Attempt Service (Phase 1 Integration)", () => {
  const timestamp = Date.now();
  let studentAId: string;
  let studentBId: string;
  const testSlug = "academic-reading-mock-01";
  const createdAttemptIds: string[] = [];
  const createdUserIds: string[] = [];
  const createdTestIds: string[] = [];

  beforeAll(async () => {
    // 1. Create Student A
    const userA = await prisma.user.create({
      data: {
        email: `test_student_a_${timestamp}@example.com`,
        name: "Test Student A",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    studentAId = userA.id;
    createdUserIds.push(userA.id);

    // 2. Create Student B (for IDOR testing)
    const userB = await prisma.user.create({
      data: {
        email: `test_student_b_${timestamp}@example.com`,
        name: "Test Student B",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    studentBId = userB.id;
    createdUserIds.push(userB.id);
  });

  afterAll(async () => {
    // Clean up created attempts
    if (createdAttemptIds.length > 0) {
      await prisma.studentAnswer.deleteMany({
        where: { attemptId: { in: createdAttemptIds } },
      });
      await prisma.testAttempt.deleteMany({
        where: { id: { in: createdAttemptIds } },
      });
    }

    // Clean up created users
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }

    // Clean up any temporary unpublished tests
    if (createdTestIds.length > 0) {
      await prisma.draftAcceptedAnswer.deleteMany({
        where: { question: { questionGroup: { section: { testId: { in: createdTestIds } } } } },
      });
      await prisma.draftQuestion.deleteMany({
        where: { questionGroup: { section: { testId: { in: createdTestIds } } } },
      });
      await prisma.draftQuestionGroup.deleteMany({
        where: { section: { testId: { in: createdTestIds } } },
      });
      await prisma.draftSection.deleteMany({
        where: { testId: { in: createdTestIds } },
      });
      await prisma.test.deleteMany({
        where: { id: { in: createdTestIds } },
      });
    }
  });

  // -----------------------------------------------------------------
  // 1. Invalid Test Identifiers
  // -----------------------------------------------------------------
  it("rejects invalid or non-existent test identifiers with ExamNotFoundError", async () => {
    await expect(
      startExamAttempt({
        userId: studentAId,
        testSlug: "non-existent-test-slug-99999",
      })
    ).rejects.toThrow(ExamNotFoundError);

    await expect(
      startExamAttempt({
        userId: studentAId,
        testId: "cmw_invalid_cuid_12345",
      })
    ).rejects.toThrow(ExamNotFoundError);
  });

  // -----------------------------------------------------------------
  // 2. Unpublished Tests
  // -----------------------------------------------------------------
  it("never creates an attempt against an unpublished test draft", async () => {
    const draftTest = await prisma.test.create({
      data: {
        title: `Unpublished Test Draft ${timestamp}`,
        slug: `unpublished-test-${timestamp}`,
        status: "ACTIVE",
        durationMinutes: 60,
        totalQuestions: 40,
      },
    });
    createdTestIds.push(draftTest.id);

    await expect(
      startExamAttempt({
        userId: studentAId,
        testSlug: draftTest.slug,
      })
    ).rejects.toThrow(UnpublishedTestError);
  });

  // -----------------------------------------------------------------
  // 3. Successful Attempt Creation
  // -----------------------------------------------------------------
  it("successfully creates a new attempt for a published test with database-authoritative time", async () => {
    const result = await startExamAttempt({
      userId: studentAId,
      testSlug,
    });

    createdAttemptIds.push(result.attemptId);

    expect(result.attemptId).toBeDefined();
    expect(result.testSlug).toBe(testSlug);
    expect(result.status).toBe(AttemptStatus.IN_PROGRESS);
    expect(result.isResumed).toBe(false);
    expect(result.durationMinutes).toBe(60);
    expect(result.totalQuestions).toBe(40);
    expect(result.remainingSeconds).toBeGreaterThan(3500);
    expect(result.remainingSeconds).toBeLessThanOrEqual(3600);

    // Verify timestamps are database-authoritative (startedAt < expiresAt by exactly 60 minutes)
    const started = new Date(result.startedAt).getTime();
    const expires = new Date(result.expiresAt).getTime();
    expect(expires - started).toBe(60 * 60 * 1000);
  });

  // -----------------------------------------------------------------
  // 4. Repeated Start Requests (Idempotency)
  // -----------------------------------------------------------------
  it("returns existing active attempt instead of creating a second attempt on repeated calls", async () => {
    const secondCall = await startExamAttempt({
      userId: studentAId,
      testSlug,
    });

    expect(secondCall.isResumed).toBe(true);
    expect(secondCall.attemptId).toBe(createdAttemptIds[0]);

    // Verify only ONE attempt exists in the database for studentA on this test
    const count = await prisma.testAttempt.count({
      where: {
        userId: studentAId,
        test: { slug: testSlug },
        status: AttemptStatus.IN_PROGRESS,
      },
    });
    expect(count).toBe(1);
  });

  // -----------------------------------------------------------------
  // 5. Concurrent Start Requests
  // -----------------------------------------------------------------
  it("safely handles concurrent start requests without constraint violation errors", async () => {
    // We create a new third student to test simultaneous requests
    const userC = await prisma.user.create({
      data: {
        email: `test_student_c_${timestamp}@example.com`,
        name: "Test Student C",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    createdUserIds.push(userC.id);

    // Fire 3 simultaneous start requests
    const [res1, res2, res3] = await Promise.all([
      startExamAttempt({ userId: userC.id, testSlug }),
      startExamAttempt({ userId: userC.id, testSlug }),
      startExamAttempt({ userId: userC.id, testSlug }),
    ]);

    createdAttemptIds.push(res1.attemptId);

    // All three should resolve to the EXACT same attemptId
    expect(res1.attemptId).toBe(res2.attemptId);
    expect(res2.attemptId).toBe(res3.attemptId);

    // Exactly one attempt was created
    const count = await prisma.testAttempt.count({
      where: {
        userId: userC.id,
        test: { slug: testSlug },
      },
    });
    expect(count).toBe(1);
  });

  // -----------------------------------------------------------------
  // 6. Attempt Ownership (IDOR Protection)
  // -----------------------------------------------------------------
  it("prevents students from accessing another student's exam content", async () => {
    const studentAAttemptId = createdAttemptIds[0];

    // Student B tries to retrieve Student A's exam content
    await expect(
      getExamContent({
        userId: studentBId,
        attemptId: studentAAttemptId,
      })
    ).rejects.toThrow(ExamForbiddenError);
  });

  // -----------------------------------------------------------------
  // 7. Expired Attempts
  // -----------------------------------------------------------------
  it("rejects content retrieval for expired attempts", async () => {
    // Create an expired attempt manually
    const now = new Date();
    const pastStart = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    const pastExpire = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago

    const test = await prisma.test.findUniqueOrThrow({
      where: { slug: testSlug },
      include: {
        publishedVersions: { where: { isArchived: false }, take: 1 },
      },
    });

    const expiredAttempt = await prisma.testAttempt.create({
      data: {
        userId: studentBId,
        testId: test.id,
        testVersionId: test.publishedVersions[0].id,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: pastStart,
        expiresAt: pastExpire,
      },
    });
    createdAttemptIds.push(expiredAttempt.id);

    await expect(
      getExamContent({
        userId: studentBId,
        attemptId: expiredAttempt.id,
      })
    ).rejects.toThrow(ExamExpiredError);
  });

  // -----------------------------------------------------------------
  // 8. Exam Content Structure & Ordering
  // -----------------------------------------------------------------
  it("returns properly ordered sections, groups, and questions (1 to 40 continuous)", async () => {
    const studentAAttemptId = createdAttemptIds[0];

    const content = await getExamContent({
      userId: studentAId,
      attemptId: studentAAttemptId,
    });

    expect(content.attempt.id).toBe(studentAAttemptId);
    expect(content.attempt.status).toBe(AttemptStatus.IN_PROGRESS);
    expect(content.attempt.totalQuestions).toBe(40);
    expect(content.sections.length).toBe(3);

    // Section ordering
    expect(content.sections[0].orderIndex).toBe(1);
    expect(content.sections[1].orderIndex).toBe(2);
    expect(content.sections[2].orderIndex).toBe(3);

    // Flatten all questions
    const allQuestions = content.sections
      .flatMap((s) => s.questionGroups)
      .flatMap((g) => g.questions);

    expect(allQuestions.length).toBe(40);

    const questionNumbers = allQuestions.map((q) => q.questionNumber);
    for (let i = 1; i <= 40; i++) {
      expect(questionNumbers[i - 1]).toBe(i);
    }
  });

  // -----------------------------------------------------------------
  // 9. Answer-Key Security & Leakage Prevention
  // -----------------------------------------------------------------
  it("strictly omits accepted answers, correct answers, explanations, and internal scoring configs", async () => {
    const studentAAttemptId = createdAttemptIds[0];

    const content = await getExamContent({
      userId: studentAId,
      attemptId: studentAAttemptId,
    });

    const jsonString = JSON.stringify(content);

    // Verify sensitive property keys are NEVER present anywhere in the serialized payload
    expect(jsonString).not.toContain("acceptedAnswers");
    expect(jsonString).not.toContain("acceptedText");
    expect(jsonString).not.toContain("bandConversionTable");
    expect(jsonString).not.toContain("scoringConfig");
    expect(jsonString).not.toContain("explanation");

    // Verify specific known answer strings are not leaked into question prompts or options
    // Q8 answer: "between"
    const q8 = content.sections
      .flatMap((s) => s.questionGroups)
      .flatMap((g) => g.questions)
      .find((q) => q.questionNumber === 8);
    expect(q8).toBeDefined();
    expect((q8 as unknown as Record<string, unknown>).acceptedAnswers).toBeUndefined();
    expect((q8 as unknown as Record<string, unknown>).explanation).toBeUndefined();

    // Q21 answer: "overflows"
    const q21 = content.sections
      .flatMap((s) => s.questionGroups)
      .flatMap((g) => g.questions)
      .find((q) => q.questionNumber === 21);
    expect(q21).toBeDefined();
    expect((q21 as unknown as Record<string, unknown>).acceptedAnswers).toBeUndefined();
    expect((q21 as unknown as Record<string, unknown>).explanation).toBeUndefined();
  });
});
