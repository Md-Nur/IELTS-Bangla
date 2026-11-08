import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { Role, AttemptStatus } from "@prisma/client";
import { createSessionToken } from "@/lib/auth/session";
import { finalizeAndScoreAttempt } from "@/lib/services/examAttemptService";
import { GET as getResultRoute } from "../[attemptId]/result/route";
import { NextRequest } from "next/server";

describe("Phase 4: IELTS Bangla Reading Result Page & Evaluation Review API", () => {
  const timestamp = Date.now();
  let defaultToken: string;
  let testId: string;
  let publishedVersionId: string;
  const testSlug = "academic-reading-mock-01";

  const createdAttemptIds: string[] = [];
  const createdUserIds: string[] = [];

  const questionsByNumber = new Map<number, { id: string; questionNumber: number }>();

  beforeAll(async () => {
    // 1. Create Default Student
    const defaultUser = await prisma.user.create({
      data: {
        email: `result_default_${timestamp}@example.com`,
        name: "Result Default Student",
        role: Role.STUDENT,
        isActive: true,
      },
    });
    createdUserIds.push(defaultUser.id);
    defaultToken = await createSessionToken({
      userId: defaultUser.id,
      email: defaultUser.email,
      role: defaultUser.role,
    });

    // 2. Resolve published test
    const test = await prisma.test.findUniqueOrThrow({
      where: { slug: testSlug },
      include: {
        publishedVersions: {
          where: { isArchived: false },
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
      },
    });

    testId = test.id;
    publishedVersionId = test.publishedVersions[0].id;

    const publishedQuestions = await prisma.publishedQuestion.findMany({
      where: { testVersionId: publishedVersionId },
      select: { id: true, questionNumber: true },
      orderBy: { questionNumber: "asc" },
    });

    for (const q of publishedQuestions) {
      questionsByNumber.set(q.questionNumber, q);
    }
  });

  afterAll(async () => {
    if (createdAttemptIds.length > 0) {
      await prisma.evaluationResult.deleteMany({
        where: { attemptId: { in: createdAttemptIds } },
      });
      await prisma.studentAnswer.deleteMany({
        where: { attemptId: { in: createdAttemptIds } },
      });
      await prisma.testAttempt.deleteMany({
        where: { id: { in: createdAttemptIds } },
      });
    }

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }
  });

  async function createStudent(label: string) {
    const user = await prisma.user.create({
      data: {
        email: `${label}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}@example.com`,
        name: `Student ${label}`,
        role: Role.STUDENT,
        isActive: true,
      },
    });
    createdUserIds.push(user.id);
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return { user, token };
  }

  async function createTestAttempt(userId: string) {
    const now = new Date();
    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        testVersionId: publishedVersionId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: now,
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
      },
    });
    createdAttemptIds.push(attempt.id);
    return attempt;
  }

  // -----------------------------------------------------------------
  // 1. Authentication & Parameter Validation
  // -----------------------------------------------------------------
  it("rejects unauthenticated requests with 401 Unauthorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/exam/attempt_123/result", {
      method: "GET",
    });

    const res = await getResultRoute(req, {
      params: Promise.resolve({ attemptId: "attempt_123" }),
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("rejects non-existent attempt ID with 404 Not Found", async () => {
    const req = new NextRequest("http://localhost:3000/api/exam/non_existent_cuid/result", {
      method: "GET",
      headers: { Authorization: `Bearer ${defaultToken}` },
    });

    const res = await getResultRoute(req, {
      params: Promise.resolve({ attemptId: "non_existent_cuid" }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.code).toBe("ATTEMPT_NOT_FOUND");
  });

  // -----------------------------------------------------------------
  // 2. State Guard: In-Progress Attempts Must Reject Result Retrieval
  // -----------------------------------------------------------------
  it("rejects result retrieval for an active IN_PROGRESS attempt with 409 Conflict", async () => {
    const { user: student, token } = await createStudent("active");
    const attempt = await createTestAttempt(student.id);

    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/result`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await getResultRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.code).toBe("ATTEMPT_STILL_IN_PROGRESS");
  });

  // -----------------------------------------------------------------
  // 3. IDOR / Cross-Student Access Protection
  // -----------------------------------------------------------------
  it("rejects result access by a different student with 403 Forbidden", async () => {
    const { user: student1 } = await createStudent("owner");
    const { token: student2Token } = await createStudent("intruder");

    const attempt = await createTestAttempt(student1.id);

    // Finalize Student 1's attempt
    await finalizeAndScoreAttempt({ userId: student1.id, attemptId: attempt.id });

    // Student 2 tries to access Student 1's result
    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/result`, {
      method: "GET",
      headers: { Authorization: `Bearer ${student2Token}` },
    });

    const res = await getResultRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("FORBIDDEN_ATTEMPT_ACCESS");
  });

  // -----------------------------------------------------------------
  // 4. Comprehensive Result & Detailed Review Payload Verification
  // -----------------------------------------------------------------
  it("returns full score summary, band estimate, and passage-grouped reviews for submitted attempt", async () => {
    const { user: student, token } = await createStudent("review");
    const attempt = await createTestAttempt(student.id);

    // Save sample answers: Q1 correct ("FALSE"), Q2 incorrect ("FALSE" instead of "TRUE")
    const q1 = questionsByNumber.get(1)!;
    const q2 = questionsByNumber.get(2)!;

    await prisma.studentAnswer.createMany({
      data: [
        {
          attemptId: attempt.id,
          testVersionId: publishedVersionId,
          questionId: q1.id,
          answerText: "FALSE",
        },
        {
          attemptId: attempt.id,
          testVersionId: publishedVersionId,
          questionId: q2.id,
          answerText: "FALSE",
        },
      ],
    });

    // Finalize
    await finalizeAndScoreAttempt({ userId: student.id, attemptId: attempt.id });

    // Fetch result
    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/result`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await getResultRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    const data = body.data;

    // Summary fields
    expect(data.attemptId).toBe(attempt.id);
    expect(data.testTitle).toBe("Academic Reading · Mock Test 01");
    expect(data.status).toBe("SUBMITTED");
    expect(data.rawScore).toBe(1);
    expect(data.totalQuestions).toBe(40);
    expect(data.totalAttempted).toBe(2);
    expect(data.totalCorrect).toBe(1);
    expect(data.totalIncorrect).toBe(39);
    expect(typeof data.estimatedBand).toBe("number");
    expect(data.scoringVersion).toBe("reading_v1.0.0");
    expect(data.bandDisclaimer).toContain("Estimated IELTS Academic Reading band");

    // Sections & Passages grouping
    expect(data.sections).toHaveLength(3);

    // Passage 1 check
    const sec1 = data.sections[0];
    expect(sec1.sectionIndex).toBe(1);
    expect(sec1.title).toContain("The Bicycle");
    expect(sec1.passageText.length).toBeGreaterThan(100);
    expect(sec1.totalQuestions).toBe(13); // Q1 to Q13

    // Check Q1 in Passage 1
    const reviewQ1 = sec1.questions.find((q: { questionNumber: number }) => q.questionNumber === 1);
    expect(reviewQ1).toBeDefined();
    expect(reviewQ1.studentAnswer).toBe("FALSE");
    expect(reviewQ1.primaryAcceptedAnswer).toBe("FALSE");
    expect(reviewQ1.isCorrect).toBe(true);
    expect(reviewQ1.scoreAwarded).toBe(1);
    expect(reviewQ1.explanation).toContain("German forester");

    // Check Q2 in Passage 1 (incorrect)
    const reviewQ2 = sec1.questions.find((q: { questionNumber: number }) => q.questionNumber === 2);
    expect(reviewQ2).toBeDefined();
    expect(reviewQ2.studentAnswer).toBe("FALSE");
    expect(reviewQ2.primaryAcceptedAnswer).toBe("TRUE");
    expect(reviewQ2.isCorrect).toBe(false);
    expect(reviewQ2.scoreAwarded).toBe(0);

    // Check Q3 in Passage 1 (unanswered)
    const reviewQ3 = sec1.questions.find((q: { questionNumber: number }) => q.questionNumber === 3);
    expect(reviewQ3).toBeDefined();
    expect(reviewQ3.studentAnswer).toBeNull();
    expect(reviewQ3.isCorrect).toBe(false);
    expect(reviewQ3.scoreAwarded).toBe(0);

    // Passage 2 check
    const sec2 = data.sections[1];
    expect(sec2.sectionIndex).toBe(2);
    expect(sec2.totalQuestions).toBe(13); // Q14 to Q26

    // Passage 3 check
    const sec3 = data.sections[2];
    expect(sec3.sectionIndex).toBe(3);
    expect(sec3.totalQuestions).toBe(14); // Q27 to Q40

    // Ensure all 40 questions are present across the 3 sections
    const totalQuestionsReviewed = data.sections.reduce(
      (sum: number, s: { questions: unknown[] }) => sum + s.questions.length,
      0
    );
    expect(totalQuestionsReviewed).toBe(40);
  });

  // -----------------------------------------------------------------
  // 5. Timed Out Attempt Result Retrieval
  // -----------------------------------------------------------------
  it("allows result retrieval for attempts concluded via TIMED_OUT", async () => {
    const { user: student, token } = await createStudent("timeout_result");
    const attempt = await createTestAttempt(student.id);

    // Force expiresAt in the past
    await prisma.testAttempt.update({
      where: { id: attempt.id },
      data: { expiresAt: new Date(Date.now() - 10000) },
    });

    // Finalize as TIMED_OUT
    await finalizeAndScoreAttempt({
      userId: student.id,
      attemptId: attempt.id,
      reason: "TIMEOUT",
    });

    const req = new NextRequest(`http://localhost:3000/api/exam/${attempt.id}/result`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await getResultRoute(req, {
      params: Promise.resolve({ attemptId: attempt.id }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("TIMED_OUT");
  });
});
